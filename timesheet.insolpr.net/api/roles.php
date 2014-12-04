<?php

class roles {

    function __construct() {
        
    }

    static function get($id) {
        global $db;
        $id = (isset($id) && $id != '') ? $id : null;
        if ($id) {
            $t = [
                ['user_roles', 'ur'],
                ['roles', 'r']
            ];

            $w = [
                ['ur.id_user', '=', $id],
                ['r.id', '=', 'ur.id_role']
            ];
            $c = $db->get($t, [], $w);
            return $c != null ? $c : [];
        } else {
            return [];
        }
    }

    function get_all() {
        global $db;

        $roles = $db->get('roles', []);
        if ($roles) {
            echo json_encode($roles);
        } else {
            echo json_encode([]);
        }
    }

    static function get_from($id) {
        global $db;
        $id = (isset($id) && $id != '') ? $id : null;
        if ($id) {
            $t = [
                ['user_roles', 'ur'],
                ['roles', 'r']
            ];

            $w = [
                ['ur.id_user', '=', $id],
                ['r.id', '=', 'ur.id_role']
            ];
            $c = $db->get($t, [], $w);
            return $c != null ? $c : [];
        } else {
            return [];
        }
    }

    function relate($user_id = null, $role_id = null, $raw = false) {
        global $db, $session;

        $user_id = $db->escape($user_id);
        $role_id = $db->escape($role_id);

        if ($role_id != '' && $user_id != '') {

            $data = [
                'id_user' => $user_id,
                'id_role' => $role_id
            ];
            $result = $db->insert('user_roles', $data);

            if ($raw) {
                return $result;
            }

            if ($result > 0) {
                echo json_encode(['result' => $result]);
            } else {
                system::error();
            }
        } else {
            system::error();
        }
    }

    function unrelate($user_id = null, $role_id = null, $raw = false) {
        global $db, $session;

        $user_id = $db->escape($user_id);
        $role_id = $db->escape($role_id);

        if ($role_id != '' && $user_id != '') {

            $data = [

                'id_user' => $user_id,
                'id_role' => $role_id
            ];

            $result = $db->delete('user_roles', $data);

            if ($raw) {
                return $result;
            }

            if ($result > 0) {
                echo json_encode(['result' => $result]);
            } else {
                system::error();
            }
        } else {
            system::error();
        }
    }

}
