<?php

class clients {
    
    public function __construct() {
 
    }

    function get_all() {
        global $db;
        $clients = $db->get('clients', [], ['enabled' => '1']);
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

}
