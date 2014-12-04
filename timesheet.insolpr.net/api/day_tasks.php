<?php

class day_tasks {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get($day_block_id, $user = null) {
        global $db;
        $db->show_query = true;

        $tables = [
            ['day_tasks' => 'dt'],
            ['projects' => 'p'],
            ['categories' => 'c'],
            ['sub_categories' => 'sc']
        ];

        $fields = [
            'dt.*',
            'p.name as project_name',
            'c.name as category_name',
            'sc.name as sub_category_name'
        ];

        $where = [
            'dt.id_day_block' => $day_block_id,
            'dt.id_user' => $user,
            ['dt.id_project', '=', 'p.id'],
            [ 'dt.id_category', '=', 'c.id'],
            [ 'dt.id_sub_category', '=', 'sc.id'],
        ];

        $tasks = $db->get($tables, $fields, $where);
        return $tasks;
    }

    function save() {

        global $db;
        $db->show_query = true;
        // print_r($_POST);

        /**
         * 
          Field                 Type        Null	Default
          id                    int(11)     No
          id_user               int(11)     No
          id_project            int(11)     No
          id_category           int(11)     No
          id_sub_category	int(11)     No
          hours                 time        Yes         NULL
          is_completed          tinyint(1)  No          0
          details               text        No
          id_day_block          int(11)     No
          enabled               tinyint(1)  No          1
          createdon             timestamp   No          CURRENT_TIMESTAMP
         */
        $fields = [
            'id_user' => $db->escape($_POST['id_user']),
            'id_project' => $db->escape($_POST['id_project']),
            'id_category' => $db->escape($_POST['id_category']),
            'id_sub_category' => $db->escape($_POST['id_sub_category']),
            'hours' => $db->escape($_POST['hours']),
            'details' => $db->escape($_POST['details']),
            'id_day_block' => $db->escape($_POST['id_day_block'])
        ];

        $result = null;
        if ($_POST['id'] > 0) {
            $result = $db->update('day_tasks', $fields, ['id' => $db->escape($_POST['id'])]);
//            echo $db->called_query;
//            exit;
        } else {
            $result = $db->insert('day_tasks', $fields);
//            echo $db->called_query;
//            exit;
        }

        if ($result > 0) {
            system::result($result);
        } else {
            system::error();
        }
    }

    function delete() {
        global $db;

        $result = $db->delete('day_tasks', ['id' => $db->escape($_POST['id'])]);
        if ($result > 0) {
            system::result($result);
        } else {
            system::error();
        }
    }

    function report($block_id) {
        
    }

}
