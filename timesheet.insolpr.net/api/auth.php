<?php

class auth {

    function __construct() {
        
    }

    function login() {
        global $db, $session;

        if ($this->login_attempt_check()) {

            $username = $db->escape($_POST['username']);
            $password = $db->escape($_POST['password']);

            if ($username != '' && $password != '') {

                $user = users::get_by_login($username, $this->encrypt_password($password));

                if (is_object($user) && $user->id > 0) {

                    if ($user->enabled == 0) {
                        system::error('Su usuario no esta activo. Favor de verifcar con la administraci&oacute;n.');
                        return;
                    }

                    $user = users::get_aditional_info($user);

                    $session->update(SESSION_USER_NAME, $user);
                    $session->update('LOGIN_ATTEMPTS', 0);

                    system::result($user, true);
                } else {
                    system::error("Su usuario y/o contrase&ntilde;a no coinciden. Por favor intentelo de nuevo.");
                }
            } else {
                system::error("Favor de llenar la forma para comenzar la sessi&oacute;n.");
            }
        }
    }

    function change_password($user_id = '', $new_pass = '', $old_pass = '', $is_automated = false) {
        global $db;
        
        $db->show_query = true;
        $old_password_from_client = ($old_pass != '') ? $old_pass : '';
        $new_password_from_client = ($new_pass != '') ? $new_pass : '';
        $user_id_from_client = ($user_id != '') ? $user_id : '';

        // echo '<pre>';
        $user = new users();
        $user_to_notify = $user->get($user_id_from_client);
        //print_r($user_to_notify);

        $settings = new settings();
        $application_settings = (object) $settings->get_all(false, true);

        //print_r($s);
        // exit;

        if ($user_to_notify->id > 0) {
            if ($is_automated) {

                $new_generated_password = ($new_password_from_client != '') ? $new_password_from_client : $this->generatePassword();
                $fields = ['password' => $this->encrypt_password($new_generated_password)];
                $where = ['id' => $user_id];

                $result = $db->update('users', $fields, $where);
                
            } else {
                
                $fields = ['password' => $this->encrypt_password($new_password_from_client)];
                $where = ['id' => $user_id, 'password' => $this->encrypt_password($old_password_from_client)];

                $result = $db->update('users', $fields, $where);
            }


            if ($user_to_notify->id > 0 && $application_settings != null && $result == 1) {

                setlocale(LC_ALL, "es_PR");
                $date = strftime("%A %d de %B del %Y");

                $email_message = ""
                        . "<div style='border:1px solid #ccc; margin: 20px auto 30px; padding:20px 20px 40px;'>"
                        . "<h1>"
                        . "<img src='{$application_settings->url}{$application_settings->logo_url}' style='width:20px; height:20px;' /> "
                        . "{$application_settings->company}"
                        . "</h1>";

                if ($is_automated) {

                    /* ***************************************************************
                     * If the system automatically changes password
                     * *************************************************************** */

                    $email_message .= ""
                            . "La administración ha cambiado su información de accesso al sistema {$application_settings->name}: <br/>"
                            . "<div style='margin:20px'>"
                            . "<strong>usuario:</strong> {$user_to_notify->username}"
                            . "<br/>"
                            . "<strong>contraseña:</strong> $new_generated_password "
                            . "</div>";
                } else {

                    /* ***************************************************************
                     * If user changes password
                     * *************************************************************** */


                    $email_message .= ""
                            . "Usted cambió su infomración de acceso a la aplicación {$application_settings->name}: <br/>"
                            . "<div style='margin:20px'>"
                            . "<strong>usuario:</strong> {$user_to_notify->username}"
                            . "<br/>"
                            . "<strong>contraseña:</strong> $new_password_from_client "
                            . "</div>";
                            
                }

                $email_message .=""
                        . "Para accesso al sistema oprima <a href='{$application_settings->url}'>aquí ({$application_settings->url})</a>"
                        . "<br/>"
                        . "<br/>"
                        . "Gracias."
                        . "<br/>"
                        . "<br/>"
                        . "<span style='color:#ccc;'>(Guarde este correo para referencia. Fecha: {$date})</span>"
                        . "</div>";


                $email_to = $user_to_notify->email;
                $email_subject = 'Cambio de Contraseña en: ' . $application_settings->name;

                $email_headers = "From: {$application_settings->admin_email}\r\n";
                $email_headers .= "MIME-Version: 1.0\r\n";
                $email_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

                /*                 * ****************************************************************
                 * Email user the new information
                 * *************************************************************** */


                if (mail($email_to, $email_subject, $email_message, $email_headers)) {
                    $m = 1;
                } else {
                    $m = 0;
                }
            }

            system::result($result);
        } else {
            system::error();
        }
    }

    function get_logged() {
        global $session;
        // echo json_encode($_SESSION);
        if ($session->exists(SESSION_USER_NAME) && $session->get(SESSION_USER_NAME)->id > 0) {

            $user = $session->get(SESSION_USER_NAME);
            unset($user->password);
            unset($user->createdon);
            system::result($user, true);
        } else {
            system::not_found();
        }
    }

    static function get($property = null) {
        global $session;
        if ($session->exists(SESSION_USER_NAME) && $session->get(SESSION_USER_NAME)->id > 0) {
            if ($property != null) {
                return $session->get(SESSION_USER_NAME)->$property;
            }
            return $session->get(SESSION_USER_NAME);
        } else {
            return false;
        }
    }

    static function is_logged() {
        global $session;
        if ($session->exists(SESSION_USER_NAME) && $session->get(SESSION_USER_NAME)->id > 0) {
            return true;
        } else {
            return false;
        }
    }

    static function is_admin() {
        global $session;
        if ($session->exists(SESSION_USER_NAME) && $session->get(SESSION_USER_NAME)->id > 0) {

            if ($session->get(SESSION_USER_NAME)->role == 2) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static function is_super_admin() {
        global $session;
        if ($session->exists(SESSION_USER_NAME) && $session->get(SESSION_USER_NAME)->id > 0) {

            if ($session->get(SESSION_USER_NAME)->role == 1) {
                return true;
            } else {
                return false;
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

        if ($session->exists(SESSION_USER_NAME)) {
            $session->purge();
            system::ok('Successfully logged out.');
        } else {
            system::not_allowed();
        }
    }

    function encrypt_password($pass, $echo = false) {

        if ($echo) {
            $p = 'original: ' . $pass;
            $p .="<br>";
            $p .="salt: " . LOGIN_AUTH_SALT;
            $p .="<br>";
            $p .="encrypted: " . sha1($pass . LOGIN_AUTH_SALT);
            echo $p;
        }
        return sha1($pass . LOGIN_AUTH_SALT);
    }

    function login_attempt_check() {
        global $session;

        // to bypass check and lock uncomment this return
        // return true;

        if ($session->get('LOGIN_LOCKED') == 1) {

            $locked_time = date('h:i', $session->get('LOGIN_LOCKED_TIMER') + LOGIN_LOCK_TIME * 60);

            if ($locked_time < date('h:i', time())) {
                $session->update('LOGIN_LOCKED', 0);
                $session->update('LOGIN_LOCKED_TIMER', '');
                $session->update('LOGIN_ATTEMPTS', 0);
                system::ok('');
                return true;
            } else {
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

                    system::error('Usted ha sobrepasado el limite de intentos para entrar al sistema. '
                            . 'Su cuenta ha sido bloqueda por los pr&oacute;ximos ' . LOGIN_LOCK_TIME . ' minutos.');

                    return false;
                }
                return true;
            } else {

                $session->add('LOGIN_LOCKED', false);
                $session->add('LOGIN_ATTEMPTS', 1);
                return true;
            }
        }
    }

    function generatePassword($length = 8) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $count = mb_strlen($chars);

        for ($i = 0, $result = ''; $i < $length; $i++) {
            $index = rand(0, $count - 1);
            $result .= mb_substr($chars, $index, 1);
        }

        return $result;
    }

}
