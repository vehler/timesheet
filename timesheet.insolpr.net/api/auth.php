<?php

class auth {

    function __construct() {
        
    }

    function login() {
        global $db, $session;

        if ($this->login_attempt_check()) {


            $u = ($_POST['username'] != '') ? $db->escape($_POST['username']) : '';
            $p = ($_POST['password'] != '') ? $db->escape($_POST['password']) : '';

            if ($u != '' && $p != '') {

                $secure_pass = $this->encrypt_password($p);
                $get_user_sql = "SELECT * FROM `users` WHERE `username` = '$u' AND `password` = '$p' AND enabled = 1";
                $user = $db->get_row($get_user_sql);

                if (is_object($user) && $user->id > 0) {

                    $get_roles_sql = "SELECT r.id, r.name FROM user_roles as ur, roles as r WHERE ur.id_user = '" . $user->id . "' AND r.id = ur.id_role AND r.enabled = 1 ORDER BY ur.id_role ASC";
                    $r = $db->get_results($get_roles_sql);
                    $user->roles = $r != null ? $r : array();

                    $get_positions_sql = "SELECT p.id, p.name FROM user_positions as up, positions as p WHERE up.id_user = '" . $user->id . "' AND p.id = up.id_position AND p.enabled = 1";
                    $po = $db->get_results($get_positions_sql);
                    $user->positions = $po != null ? $po : array();

                    $get_clients_sql = "SELECT c.id, c.name FROM user_clients as uc, clients as c WHERE uc.id_user = '" . $user->id . "' AND c.id = uc.id_client AND c.enabled = 1";
                    $c = $db->get_results($get_clients_sql);
                    $user->clients = $c != null ? $c : array();

                    $get_projects_sql = "SELECT p.id, p.name FROM user_projects as up, projects as p WHERE up.id_user = '" . $user->id . "' AND p.id = up.id_project AND p.enabled = 1";
                    $pr = $db->get_results($get_projects_sql);
                    $user->projects = $pr != null ? $pr : array();

                    if (debug) {
                        // $user->db_errors = $db->get_debug();
                    }

                    $session->update('USER', $user);
                    $session->update('LOGIN_ATTEMPTS', 0);


                    echo json_encode($user);
                } else {
                    system::not_found();
                }
            } else {
                
            }
        } // login attempt check
        
    }

    function get_logged() {
        global $session;
        // echo json_encode($_SESSION);
        if ($session->exists('USER') && $session->get('USER')->id > 0) {

            $user = $session->get('USER');
            unset($user->password);
            unset($user->createdon);
            echo json_encode($user);
        } else {
            system::not_found();
        }
    }

    static function get() {
        global $session;
        if ($session->exists('USER') && $session->get('USER')->id > 0) {
            return $session->get('USER');
        } else {
            return false;
        }
    }

    static function is_logged() {
        global $session;
        if ($session->exists('USER') && $session->get('USER')->id > 0) {
            return true;
        } else {
            return false;
        }
    }

    static function is_admin() {
        global $session;
        if ($session->exists('USER') && $session->get('USER')->id > 0) {
            foreach ($_SESSION['USER']->roles as $role) {
                if ($role->id == 2) {
                    echo $role->name;
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    static function is_super_admin() {
        global $session;
        if ($session->exists('USER') && $session->get('USER')->id > 0) {
            foreach ($_SESSION['USER']->roles as $role) {
                if ($role->id == 1) {
                    echo $role->name;
                    ;
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }

    static function re_auth() {
        system::not_allowed();
    }

    function logout() {
        global $session;

        if ($session->exists('USER')) {
            $session->purge();
            system::ok('Successfully logged out.');
        } else {
            system::not_allowed();
        }
    }

    function encrypt_password($pass) {


        return $pass; // $e_pass;
    }

    function login_attempt_check() {
        global $session;

        if ($session->get('LOGIN_LOCKED') == 1) {

            $locked_time = date('h:i', $session->get('LOGIN_LOCKED_TIMER') + LOGIN_LOCK_TIME * 60);

            if ($locked_time < date('h:i', time())) {

                //echo ($session->get('LOGIN_LOCKED_TIMER') + LOGIN_LOCK_TIME * 60 );
                /// echo '<br/>';
                // echo 'mas de' . LOGIN_LOCK_TIME;
                // echo '<br/>';
                $session->update('LOGIN_LOCKED', 0);
                $session->update('LOGIN_LOCKED_TIMER', '');
                $session->update('LOGIN_ATTEMPTS', 0);
                system::ok('');
                return true;
            } else {
                // echo '<br/>';
                // echo 'total locked time: ' .$locked_time;
                // echo '<br/>';
                //echo 'todavia';
                // echo '<br/>';
                $locked_time_left = date('h:i A', $session->get('LOGIN_LOCKED_TIMER') + (LOGIN_LOCK_TIME + 1) * 60);
                system::error('Usted ha sobrepasado el limite de intentos para entrar al sistema. Su cuenta ha sido bloqueda por motivos de seguridad. '
                        . 'Por favor espere hasta ' . $locked_time_left . '  entrar a su cuenta.');
                return false;
            }
        } else {
            if ($session->exists('LOGIN_ATTEMPTS')) {
                $session->update('LOGIN_ATTEMPTS', $session->get('LOGIN_ATTEMPTS') + 1);

                if ($session->get('LOGIN_ATTEMPTS') >= LOGIN_MAX_ATTEMPTS) {

                    $session->add('LOGIN_LOCKED', 1);
                    $session->add('LOGIN_LOCKED_TIMER', time());

                    system::error('Usted ha sobrepasado el limite de intentos para entrar al sistema. Su cuenta ha sido bloqueda por los pr&oacute;ximos ' . LOGIN_LOCK_TIME . ' minutos.');

                    return false;
                }
                return true;
            } else {

                $session->add('LOGIN_LOCKED', false);
                $session->add('LOGIN_ATTEMPTS', 1);
                return true;
            }
        }
        //echo 'locked time: ' . date('h:i', $session->get('LOGIN_LOCKED_TIMER'));
        // echo '<br/>';
        //echo 'time: ' . date('h:i', time());
        //echo '<br/>';
        // echo '<pre>';
        // print_r($_SESSION);
    }

}
