<?php

class router {

    private $class;
    private $method;
    private $args;

    function __construct($allowed_routes = array()) {


        $params = split("/", $_SERVER['REQUEST_URI']);
        array_shift($params);
        array_shift($params);
        $this->class = $params[0] && $params[0] != '' ? $params[0] : "";
        $this->method = $params[1] && $params[1] != '' ? $params[1] : "";
        $this->args = $params[2] && $params[2] != '' ? $this->set_args($params[2]) : "";

        if (file_exists("" . $this->class . ".php")) {
            include_once "" . $this->class . ".php";


            if (!empty($allowed_routes) && in_array($this->class, $allowed_routes)) {
                if (class_exists($this->class)) {

                    $class = new $this->class();

                    if (method_exists($class, $this->method)) {

                        if (is_array($this->args)) {
                            call_user_method($this->method, $class, $this->args);
                        } else {
                            call_user_method($this->method, $class);
                        }
                    }
                } else {

                    // No Class exists
                   // system::not_found();
                }
            } else {
                       // No access
                    system::not_allowed();          
            }
        } else {

            // No file exists
            system::not_found();
        }
    }

    function set_args($args) {

        if (strpos($args, "?") !== false) {
            $args = substr($args, 1);
        }

        $original_arguments = split('&', $args);
        $prepared_arguments = array();
        foreach ($original_arguments as $argument) {
            $a = split("=", $argument);
            $prepared_arguments[$a[0]] = $a[1];
        }
        return $prepared_arguments;
    }

}
