<?php

class router {

    private $class;
    private $method;
    private $args;
    private $allowed_routes;

    function __construct($allowed_routes = array()) {
        /**
         * Get the URI 
         */
        $full_uri = $_SERVER['REQUEST_URI'];

        /**
         * Set the allowed routes for this application
         */
        $this->allowed_routes = $allowed_routes;

        /**
         * Check if $_GET array is present so we can split from it and stop it 
         * from dirtying up the routes
         */
        if (strpos($full_uri, '?') !== false) {

            /**
             * Separate the get from the url
             */
            $uri = explode("?", $full_uri);

            $url = $uri[0];
            /**
             * Remove the last slash 
             */
            if (substr($url, -1) == '/') {
                $url = substr($url, 0, -1);
            }

            /**
             * Convert the url to a easy to digest array
             */
            $url = explode("/", substr($url, 1));

            /**
             * Call the route
             */
            $this->call_routes($url);
        } else {

            $url = $full_uri;
            /**
             * Remove the last slash 
             */
            if (substr($full_uri, -1) == '/') {
                $url = substr($url, 0, -1);
            }

            /**
             * Convert the url to a easy to digest array
             */
            $url = explode("/", substr($url, 1));

            /**
             * Call the route
             */
            $this->call_routes($url);
        }
    }

    private function call_routes($url) {

        /**
         * Set Class name
         */
        $this->class = $url[1];

        /**
         * Set method name
         */
        $this->method = $url[2];

        /**
         * Remove unnecesary items from the array
         */
        unset($url[0]);
        unset($url[1]);
        unset($url[2]);
        $url = array_values($url);

        /**
         * Expand into an array any arguments that have the ':' delimiter
         */
        $i = 0;
        foreach ($url as $u) {
            if (strpos($u, ":")) {
                unset($url[$i]);
                $array = explode(":", $u);
                array_push($url, $array);
            }
            $i++;
        }

        /**
         * Reset the count of arguments
         */
        $arguments = array_values($url);

        /**
         * Set the remaning routes array as arguments for the method
         */
        $this->args = $arguments;

        /**
         * Check if the current class if an allowed route 
         */
        if (!empty($this->allowed_routes) && !in_array($this->class, $this->allowed_routes)) {
            system::not_allowed();
            exit();
        }

        /**
         * Check if the class exists.
         */
        if (class_exists($this->class)) {
            /**
             * Call the class and methods
             */
            $this->call_class_and_methods();
        } else {
            /**
             * Return an error JSON if route can't be found.
             */
            system::not_found();
        }
    }

    private function call_class_and_methods() {

        /**
         * Initialize the class
         */
        $class = new $this->class();

        /**
         * Check if method is available
         */
        if (method_exists($class, $this->method)) {

            /**
             * Check if there are arguments that can be passed to the method
             */
            if (is_array($this->args) && !empty($this->args)) {

                /**
                 * If there are arguments, call the method with them.
                 */
                call_user_method_array($this->method, $class, $this->args);
            } else {

                /**
                 * If not, just call the method
                 */
                call_user_method($this->method, $class);
            }
        }
    }

}
