<?php

class day_types {

    function __construct() {
        
    }

    function get_all() {
        global $db;

        $sql = "select id,name,label,description from insol_timesheet.day_types where enabled = 1";

        $day_type = $db->get_results($sql);
        $day_type = !empty($day_type) ? $day_type : array();
        echo json_encode($day_type);
    }

}
