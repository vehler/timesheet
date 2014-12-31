<?php

class clients {

    public function __construct() {
        
    }

    function get_all() {
        global $db;
        $clients = $db->get('clients', []);
        if ($clients) {
            system::result($clients, true);
        } else {
            system::not_found();
        }
    }

    function relate($user_id = null, $client_id = null) {
        global $db, $session;

        $client_id = ($client_id != null) ? $client_id : $db->escape($_POST['id']);
        $user_id = ($user_id != null) ? $user_id : $db->escape($_POST['user_id']);


        //       print_r($_POST);
        //       exit;
        if ($client_id != '' && $user_id != '') {

            $data = [
                'id_user' => $user_id,
                'id_client' => $client_id
            ];
            $result = $db->insert('user_clients', $data);
            if ($result > 0) {
                $session->update('clients', self::get_from($user_id), SESSION_USER_NAME);
                system::result($result);
            } else {
                system::error('1');
            }
        } else {
            system::error('2');
        }
    }

    function unrelate($user_id = null, $client_id = null) {
        global $db, $session;

        $client_id = ($client_id != null) ? $client_id : $db->escape($_POST['id']);
        $user_id = ($user_id != null) ? $user_id : $db->escape($_POST['user_id']);

//        echo $client_id;
//        echo $user_id;
//        exit;
        if ($client_id != '' && $user_id != '') {

            $data = [

                'id_user' => $user_id,
                'id_client' => $client_id
            ];

            $result = $db->delete('user_clients', $data);

            // print_r($db->get_debug());

            if ($result > 0) {
                $session->update('clients', self::get_from($user_id), SESSION_USER_NAME);
                system::result($result);
            } else {
                system::error('1');
            }
        } else {
            system::error('2');
        }
    }

    static function get_from($user_id) {
        global $db;
        $user_id = (isset($user_id) && $user_id != '') ? $user_id : null;
        if ($user_id) {
            $t = [
                ['user_clients' => 'uc'],
                ['clients' => 'c']
            ];
            $w = [
                ['uc.id_user', '=', $user_id],
                ['c.id', '=', 'uc.id_client']
            ];
            $clients = $db->get($t, [], $w);
            return $clients != null ? $clients : [];
        } else {
            return [];
        }
    }

    function save() {
        global $db;

        $client = [
            'name' => $db->escape($_POST['name']),
            'description' => $db->escape($_POST['description']),
            'email' => $db->escape($_POST['email']),
            'contact_person' => $db->escape($_POST['contact_person']),
            'phone' => $db->escape($_POST['phone']),
            'address' => $db->escape($_POST['address'])
        ];

        if (helper::bool($_POST['new']) === true) {

            $new_client = $db->insert(__CLASS__, $client);
            $new_client_id = $db->insert_id;

            if ($new_client_id > 0) {
                echo json_encode(['result' => $new_client, 'id' => $new_client_id]);
            } else {
                system::error();
            }
        } else {

            if ($_POST['id'] != '') {

                $edited = $db->update(__CLASS__, $client, ['id' => $db->escape($_POST['id'])]);

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
        $result = $db->delete('clients', ['id' => $id]);
        //echo $db->called_query;
        if ($result > 0) {
            // echo json_encode(['result' => $result]);
            system::result($result);
        } else {
            system::error();
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

            $result = $db->update(__CLASS__, ['enabled' => $enabled], ['id' => $id]);
            if ($result != null) {
                
                echo json_encode(['result' => $result, 'enabled' => $enabled]);
            } else {
                system::error('No se pudo cambiar el estatus del cliente 1');
            }
        } else {
            system::error('No se pudo cambiar el estatus del cliente 2');
        }
    }

}
