<?php

class categories {

    public $db;

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get_all() {
        global $db;

        $get_categories_sql = "select id,name,classification from insol_timesheet.categories where enabled = 1";

        $categories = $db->get_results($get_categories_sql);
        $categories = !empty($categories) ? $categories : array();

        if ($categories) {
            system::result($categories, true);
        } else {
            system::not_found();
        }
    }

}

?>