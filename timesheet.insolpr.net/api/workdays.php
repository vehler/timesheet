<?php

/**
 * Description of workdays
 *
 * @author vehler
 */
class workdays {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get($params) {

        global $db;

        $d = $params['date'];
        $u = auth::get()->id;

        $get_sql = "select * from workdays where `date` = '$d' AND `user` = '$u' AND enabled = 1";

        $w = $db->get_results($get_sql);

        if ($w != null && is_array($w)) {
            $workdays = $w;
        } else {
            $workdays = array();
        }

        if (debug) {
            $workdays['debug'] = $db->get_debug();
        }
        //print_r($workdays);
        echo json_encode($workdays);
    }
    
    function addDay($params = array()) {
        global $db;
        $sql = "INSERT INTO `insol_timesheet`.`workdays` "
                . "(`id`, `date`, `id_client`, `billable`, `enabled`, `start_time_1`, `end_time_1`, `start_time_2`, `end_time_2`, `user`, `createdon`) "
                . "VALUES "
                . "(NULL, '2014-09-25', '1', '1', '1', '09:00:00', '12:00:00', '01:00:00', '04:00:00', '1', CURRENT_TIMESTAMP);";
    }
}
