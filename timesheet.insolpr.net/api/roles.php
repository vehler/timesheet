<?php

class roles {

    function __construct() {
    }

    function get_all() {
        global $db;

        $get_roles_sql = "SELECT id,name FROM insol_timesheet.roles where  enabled = 1";
        $roles = $db->get_results($get_roles_sql);
        $roles = !empty($roles) ? $roles : array();
        echo json_encode($roles);
    }

}