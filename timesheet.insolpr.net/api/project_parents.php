<?php

class project_parents {

    function __construct() {
        
    }

    function get_all() {

        global $db;
        $projects = $db->get('parent_projects', []);
        echo system::result($projects, true);
    }

}
