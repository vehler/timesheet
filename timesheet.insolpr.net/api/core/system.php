<?php

class system {

    function __construct() {
        
    }

    function fix() {

        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }

        global $db;

        auth::is_super_admin();
        auth::is_admin();

        //var_dump($db->query("ALTER TABLE subcats CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci"));
        //ALTER TABLE etape_prospection CONVERT TO CHARACTER SET utf8;
        //ALTER DATABASE databasename CHARACTER SET utf8 COLLATE utf8_unicode_ci;
        //ALTER TABLE tablename CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
    //
    }

    function check() {
        print_r($_GLOBALS);
    }

    function get_session() {
        global $session;
        echo json_encode($session->get_all());
    }

    function raw_session() {

        echo json_encode($_SESSION);
    }

    function session_purge() {
        session_unset();
        session_destroy();
        session_regenerate_id();
        echo json_encode($_SESSION);
    }

    function test($params = null, $p = null) {

//        global $db;
//        
//        $a = [
//            'first' => 'super value',
//            'second' => 'mega value',
//            'third' => 'ultra value',
//            'fourth' => 'giga value'
//        ];
//        
//        echo helper::implode_assoc($a);
//        
//        echo "<br/";

        $n = ['first', 'second', 'third'];
        echo helper::implode_numeric($n);
    }

    /**
     * Require the file
     *
     *
     * @param string $_file Path to template file.
     * @param bool $require_once Whether to require_once or require. Default true.
     */
    static function load($_file, $require_once = true) {
        if (file_exists($_file)) {
            if ($require_once) {
                require_once( $_file );
            } else {
                require( $_file );
            }
        }
    }

    static function not_found() {
        echo json_encode(array(
            'status' => 404,
            'error' => true,
            'message' => 'The information you were looking for was not found.'
        ));
    }

    static function error($msg = '') {
        echo json_encode(array(
            'status' => 400,
            'error' => true,
            'message' => !empty($msg) ? $msg : 'The was an error in your request.'
        ));
    }

    static function ok($msg = '') {
        echo json_encode(array(
            'status' => 200,
            'error' => false,
            'message' => !empty($msg) ? $msg : 'Success'
        ));
    }

    static function user_not_found() {
        echo json_encode(array(
            'status' => 404,
            'error' => true,
            'message' => ''
        ));
    }

    static function not_allowed() {
        echo json_encode(array(
            'status' => 403,
            'error' => true,
            'message' => 'You are not authorized to do this action.'
        ));
    }

    static function result($respone, $rawjson = false, $return = false) {
        if ($rawjson) {
            if ($return)
                return json_encode($respone);
            else
                echo json_encode($respone);
        } else {
            if ($return)
                return json_encode(['result' => $respone]);
            else
                echo json_encode(['result' => $respone]);
        }
    }

}
