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
        $projects = $db->get('projects', [], ['enabled' => '1']);
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

    function create() {
        
    }

    function delete() {
        
    }

    function enable() {
        
    }

    function disable() {
        
    }

}
