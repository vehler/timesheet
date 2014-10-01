<?php

class tasks {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get_tasks() {
        global $db;

        if (auth::is_logged()) {

            echo 'yep';
        } else {
            echo 'nope';
        }
    }

}
