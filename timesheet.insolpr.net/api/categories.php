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

    function save() {
        global $db;

        $category = [
            'name' => $db->escape($_POST['name']),
            'description' => $db->escape($_POST['description']),
        ];

//        print_r($_POST);
//        exit;
        if (helper::bool($_POST['new']) === true) {

            $new_cat = $db->insert(__CLASS__, $category);
            $new_cat_id = $db->insert_id;

            if ($new_cat_id > 0) {
                echo json_encode(['result' => $new_cat, 'id' => $new_cat_id]);
            } else {
                system::error();
            }
        } else {

            if ($_POST['id'] != '') {

                $edited = $db->update(__CLASS__, $category, ['id' => $db->escape($_POST['id'])]);

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