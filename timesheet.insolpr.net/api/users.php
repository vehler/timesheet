<?php

class users {

    private $db;

    function __construct($db) {
        var_dump($db);
        $this->db = $db;        
    }
    
    function get_users($params) {
       // echo 'get_users method';
        echo json_encode($params);
    }

}