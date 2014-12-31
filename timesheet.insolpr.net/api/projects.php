<?php

class projects {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get_all() {
        global $db;
        $projects = $db->get('projects', []);
        echo json_encode($projects);
    }

    function get_by_client($id_client) {
        global $db;
        $id_client = helper::getvar('id_client', $id_client);
        $projects = $db->get('projects', [], ['enabled' => '1', 'id_client' => $id_client]);
        echo json_encode($projects);
    }

    function relate($user_id = null, $project_id = null) {
        global $db, $session;

        $project_id = $db->escape($_POST['id']);
        $user_id = $db->escape($_POST['user_id']);

        if ($project_id != '' && $user_id != '') {

            $data = [
                'id_user' => $user_id,
                'id_project' => $project_id
            ];
            $result = $db->insert('user_projects', $data);
            if ($result > 0) {
                $session->update('projects', self::get_from($user_id), SESSION_USER_NAME);
                echo json_encode(['result' => $result]);
            } else {
                system::error();
            }
        } else {
            system::error();
        }
    }

    function unrelate($user_id = null, $project_id = null) {
        global $db, $session;

        $project_id = $db->escape($_POST['id']);
        $user_id = $db->escape($_POST['user_id']);

//        echo $project_id;
//        echo $user_id;
//        exit;
        if ($project_id != '' && $user_id != '') {

            $data = [

                'id_user' => $user_id,
                'id_project' => $project_id
            ];

            $result = $db->delete('user_projects', $data);

            if ($result > 0) {
                $session->update('projects', self::get_from($user_id), SESSION_USER_NAME);
                echo json_encode(['result' => $result]);
            } else {
                system::error();
            }
        } else {
            system::error();
        }
    }

    static function get_from($id) {
        global $db;
        $id = (isset($id) && $id != '') ? $id : null;
        if ($id) {
            $t = [
                ['user_projects' => 'up'],
                ['projects' => 'p'],
            ];
            $f = ['p.id', 'p.name'];
            $w = [
                ['up.id_user', '=', $id],
                ['p.id', '=', 'up.id_project']
            ];
            $c = $db->get($t, [], $w);
            return $c != null ? $c : [];
        } else {
            return [];
        }
    }

    function enable() {
        
    }

    function disable() {
        
    }

    function save() {
        global $db;

        $project = [
            'name' => $db->escape($_POST['name']),
            'description' => $db->escape($_POST['description']),
            'id_client' => $db->escape($_POST['id_client']),
            'hours_assigned' => $db->escape($_POST['hours_assigned']),
            'contact_person' => $db->escape($_POST['contact_person']),
            'is_deliverable' => $db->escape($_POST['is_deliverable']),
            'parent_project_id' => $db->escape($_POST['parent_project_id']),
        ];

//        print_r($_POST);
//        exit;
        if (helper::bool($_POST['new']) === true) {

            $new_project = $db->insert(__CLASS__, $project);
            $new_project_id = $db->insert_id;

            if ($new_project_id > 0) {
                echo json_encode(['result' => $new_project, 'id' => $new_project_id]);
            } else {
                system::error();
            }
        } else {

            if ($_POST['id'] != '') {

                $edited = $db->update(__CLASS__, $project, ['id' => $db->escape($_POST['id'])]);

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
