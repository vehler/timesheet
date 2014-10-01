<?php

class day_type {

    function __construct() {
        
    }

    function get_all() {
        global $db;

        $sql = "select id,name from insol_timesheet.day_type where enabled = 1";

        $day_type = $db->get_results($sql);
        if ($day_type != null){
            echo json_encode($day_type);
        } else {
            system::not_found();
        }
        
    }

}
