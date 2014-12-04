<?php

class sub_categories {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get_all() {
        global $db;

        $get_sub_sql = "SELECT id,name,id_category FROM insol_timesheet.sub_categories where  enabled = 1";
        $subs = $db->get_results($get_sub_sql);
        $subs = !empty($subs) ? $subs : array();
        echo json_encode($subs);
    }

    function get($parameters) {
        global $db;

        $categoriaId = $parameters["id"];

        $get_subcategories_sql = "SELECT * FROM insol_timesheet.subcats where id_category = $categoriaId  and enabled = 1";

        $subcategories = $db->get_results($get_categories_sql);
        $subcategories = !empty($subcategories) ? $subcategories : array();

        echo json_encode($subcategories);
    }

}

?>
