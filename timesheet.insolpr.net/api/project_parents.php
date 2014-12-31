<?php

class project_parents {

    function __construct() {
        
    }

    function get_all() {

        global $db;
        $db->show_query = true;
        $tables = [
            [__CLASS__ => 'pp'],
            ['clients' => 'c']
        ];
        $fields = [
            'pp.*',
            'c.name as client_name'
        ];
        $where = [
            ['c.id', '=', 'pp.client_id']
        ];
        
        
        $projects = $db->get($tables, $fields, $where);
        
       // print_r($db->get_debug());
        echo system::result($projects, true);

    }

    
    function save() {
        global $db;

        $project_parent = [
            'name' => $db->escape($_POST['name']),
            'client_id' => $db->escape($_POST['client_id']),
        ];

//        print_r($_POST);
//        exit;
        if (helper::bool($_POST['new']) === true) {

            $new_project_parent = $db->insert(__CLASS__, $project_parent);
            $new_project_parent_id = $db->insert_id;

            if ($new_project_parent_id > 0) {
                echo json_encode(['result' => $new_project_parent, 'id' => $new_project_parent_id]);
            } else {
                system::error();
            }
        } else {

            if ($_POST['id'] != '') {

                $edited = $db->update(__CLASS__, $project_parent, ['id' => $db->escape($_POST['id'])]);

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
