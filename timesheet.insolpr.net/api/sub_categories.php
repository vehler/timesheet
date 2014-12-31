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

    function save() {
        global $db;

        $sub_category = [
            'name' => $db->escape($_POST['name']),
            'id_category' => $db->escape($_POST['id_category'])
        ];

//        print_r($_POST);
//        exit;
        if (helper::bool($_POST['new']) === true) {

            $new_cat = $db->insert(__CLASS__, $sub_category);
            $new_cat_id = $db->insert_id;

            if ($new_cat_id > 0) {
                echo json_encode(['result' => $new_cat, 'id' => $new_cat_id]);
            } else {
                system::error();
            }
        } else {

            if ($_POST['id'] != '') {

                $edited = $db->update(__CLASS__, $sub_category, ['id' => $db->escape($_POST['id'])]);

                if ($edited > 0) {
                    echo json_encode(['result' => $edited]);
                } else {
                    system::error("1");
                }
            } else {
                system::error("2");
            }
        }
        // print_r($db->get_debug());
    }

    function delete() {
        global $db;

        $id = $db->escape($_POST['id']);
        //$db->show_query = true;
        $result = $db->delete(__CLASS__, ['id' => $id]);
        //echo $db->called_query;
        if ($result > 0) {
            // echo json_encode(['result' => $result]);
            system::result($result);
        } else {
            system::error();
        }
    }

}