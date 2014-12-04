<?php

class days {

    function get($month) {
        global $db;



        $db->get('days', []);
        print_r("from server " . $month);
    }

}
