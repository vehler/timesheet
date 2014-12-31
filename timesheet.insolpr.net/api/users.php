<?php

class users {

    function __construct() {
        
    }

    function get_all($enabled = false) {
        global $db;
        $db->show_query = true;
        $tables = [
            ['users' => 'u'],
            ['roles' => 'r']
        ];
        $fields = [
            'u.*',
            'r.label as role_label'
        ];
        $where = [
            ['u.role', '=', 'r.id']
        ];
        if ($enabled) {
            array_push($where, ['u.enabled', '=', '1']);
        }
        $users = $db->get($tables, $fields, $where, [], 'u.id');


        //echo $db->called_query;
        //exit;
        if ($users) {
            foreach ($users as $user) {
                $user = self::get_aditional_info($user);
                $user->password = "";
            }
            echo json_encode($users);
        } else {
            system::not_found();
        }
    }

    static function get($id) {
        global $db;
        $db->show_query = true;
        $tables = [['users' => 'u'], ['roles' => 'r']];
        $fields = ['u.*', 'r.label as role_label', 'r.name as role_name'];
        $where = [
            'u.id' => $id,
            ['u.role', '=', 'r.id']
        ];
        $user = $db->get_one($tables, $fields, $where);

        if ($user) {
            $user = self::get_aditional_info($user);
            $user->password = "";
            return $user;
        } else {
            return [];
        }
    }

    static function get_by_login($username, $password) {
        global $db;
        $db->show_query = true;
        $tables = [['users' => 'u'], ['roles' => 'r']];
        $fields = ['u.*', 'r.label as role_label', 'r.name as role_name'];
        $where = [
            'username' => $username,
            'password' => $password,
            ['u.role', '=', 'r.id']
        ];
        $user = $db->get_one($tables, $fields, $where);

        //echo $db->called_query;
        
        if ($user) {
           
            $user = self::get_aditional_info($user);
            $user->password = "";
            
            //print_r($user);
            return $user;
        } else {
            return [];
        }
    }

    static function get_by($field, $value) {
        global $db;
        $db->show_query = true;
        $tables = [['users' => 'u'], ['roles' => 'r']];
        $fields = ['u.*', 'r.label as role_label', 'r.name as role_name'];
        $where = [
            'u.' . $field => $value,
            ['u.role', '=', 'r.id']
        ];
        $user = $db->get_one($tables, $fields, $where);

        //print_r($db->get_debug());

        if ($user) {
            if (count($user) > 1) {
                $user[0] = self::get_aditional_info($user[0]);
                $user[0]->password = '';
                system::result($user[0], true);
            } else {
                $user = self::get_aditional_info($user);
                $user->password = "";
                system::result($user, true);
            }
        } else {
            return [];
        }
    }

    function save() {
        global $db;
        if (helper::bool($_POST['new']) === true) {

            //print_r($_POST);

            $auth = new auth();

            $new = [
                'full_name' => $db->escape($_POST['full_name']),
                'username' => $db->escape($_POST['username']),
                'email' => $db->escape($_POST['email']),
                'password' => $auth->encrypt_password($db->escape($_POST['full_name'])),
                'hourly_rate' => $db->escape($_POST['hourly_rate']),
                'phone' => $db->escape($_POST['phone']),
                'address' => $db->escape($_POST['address']),
                'is_contract' => $db->escape($_POST['is_contract']),
                'role' => $db->escape($_POST['role'])];

            $new_user = $db->insert('users', $new);
            $new_user_id = $db->insert_id;

            if ($new_user_id > 0) {
                echo json_encode(['result' => $new_user, 'id' => $new_user_id]);
            } else {
                system::error();
            }
        } else {

            //print_r($_POST);
            //exit;
            if ($_POST['id'] != '') {
                $user_to_edit = [
                    'full_name' => $db->escape($_POST['full_name']),
                    'username' => $db->escape($_POST['username']),
                    'email' => $db->escape($_POST['email']),
                    'hourly_rate' => $db->escape($_POST['hourly_rate']),
                    'phone' => $db->escape($_POST['phone']),
                    'address' => $db->escape($_POST['address']),
                    'is_contract' => $db->escape($_POST['is_contract']),
                    'role' => $db->escape($_POST['role'])];

                $edited = $db->update('users', $user_to_edit, ['id' => $db->escape($_POST['id'])]);

                if ($edited > 0) {
                    echo json_encode(['result' => $edited]);
                } else {
                    system::error();
                }
            } else {
                system::error();
            }
        }
    }

    function delete() {
        global $db;

        $id = $db->escape($_POST['id']);
        //$db->show_query = true;
        $result = $db->delete('users', ['id' => $id]);
        //echo $db->called_query;
        if ($result > 0) {
           // echo json_encode(['result' => $result]);
            system::result($result);
        } else {
            system::error();
        }
    }

    function check($field, $value) {

        global $db;
        $db->show_query = true;
        $result = $db->get_one('users', 'id', [$field =>$value]);
       // echo $db->called_query;
        if (count($result) > 0) {
            system::result($result);
            //echo json_encode(['result' => '1']);
        } else {
            system::result($result);
            // echo json_encode(['result' => '0']);
        }
    }

    function enable() {
        global $db;
        $db->show_query = true;
        $id = $db->escape($_POST['id']);
        $enabled = $db->escape($_POST['enabled']);

        // print_r($_POST);
        // echo $enabled;

        if ($id != "" && $enabled != "") {

            if ($enabled == 1) {
                $enabled = 0;
            } else {
                $enabled = 1;
            }

            $result = $db->update('users', ['enabled' => $enabled], ['id' => $id]);
            if ($result != null) {
                echo json_encode(['result' => $result, 'enabled' => $enabled]);
            } else {
                system::error('No se pudo cambiar el estatus del usuario 1 - ' . $db->called_query);
            }
        } else {
            system::error('No se pudo cambiar el estatus del usuario 2 - ' . $db->called_query);
        }
    }

    static function get_aditional_info($user) {
        //if ($user->role > 2) {
            $user->clients = clients::get_from($user->id);
            $user->has_clients = (!$user->clients == []) ? true : false;
            $user->projects = projects::get_from($user->id);
            $user->has_projects = (!$user->projects == []) ? true : false;
       // }
        return $user;
    }

}
