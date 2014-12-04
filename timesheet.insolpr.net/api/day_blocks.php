<?php

/**
 * Description of workdays
 * 
  Field         Type        Null	Default
  id            int(11)     No
  date	date	No
  id_day_type	int(11)     No          1
  id_client	int(11)     No
  is_billable	tinyint(1)  No          1
  is_overtime	tinyint(1)  No          0
  enabled	tinyint(1)  No          1
  start_time	time        No
  end_time	time        No
  id_user	int(11)     No
  createdon	timestamp   No          CURRENT_TIMESTAMP
 * 
 * @author vehler
 */
class day_blocks {

    function __construct() {
        if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }
    }

    function get_between_dates($user_id = null, $from = null, $to = null) {
        global $db;
        $db->show_query = true;
        /**
         * Gets the first day of the month called if null sets the default to current month
         */
        $fd = date("Y-m-d", mktime(0, 0, 0, date("m"), 1, date("Y")));
        $first_of_the_month = ($from != '') ? $db->escape($from) : $fd;

        /**
         * Gets the last day of the month called if null sets the default to current month
         */
        $ld = date("Y-m-d", mktime(0, 0, 0, date("m"), date('t'), date("Y")));
        $last_of_the_month = ($to != '') ? $db->escape($to) : $ld;

        /**
         * Gets the user id if null uses the user logged in the system
         */
        $u = ($user_id != null) ? $user_id : auth::get('id');

        $tables = [
            ['day_blocks' => 'db'],
            ['clients' => 'c'],
            ['day_types' => 'dt']
        ];
        $fields = [
            'db.*', 'c.name as client_name', 'dt.label as day_type_name'
        ];
        $where = [
            ['db.date', 'BETWEEN', helper::to_date($first_of_the_month), 'AND', helper::to_date($last_of_the_month)],
            ['db.id_user', '=', $u],
            ['db.id_client', '=', 'c.id'],
            ['db.id_day_type', '=', 'dt.id']
        ];

        $day_blocks = $db->get($tables, $fields, $where, [], 'date');

//        echo $db->called_query;
//        exit;

        if ($day_blocks) {
            $i = 0;
            $tasks = new day_tasks();
            foreach ($day_blocks as $block) {

                /**
                 * Create a new object to holds all the hours calculations
                 */
                $start = strtotime($block->date . ' ' . $block->start_time);
                $end = strtotime($block->date . ' ' . $block->end_time);

                $block->hours = new stdClass();
                $block->hours->total = abs($start - $end) / 3600;
                $block->hours->from_tasks = 0;
                $block->hours->available = $block->hours->total;
                $block->hours->is_full = false;
                $block->hours->is_over = false;

                /**
                 * Add a new array to hold tasks
                 */
                $block->tasks = [];

                /**
                 * Get all tasks for that block
                 */
                $block_tasks = $tasks->get($block->id, $user_id);
                if ($block_tasks) {

                    /**
                     * Iterate through tasks to get the hours entered
                     */
                    foreach ($block_tasks as $task) {
                        $block->hours->from_tasks = $block->hours->from_tasks + $task->hours;
                    }

                    $block->hours->available = abs($block->hours->total - $block->hours->from_tasks);
                    $block->hours->is_full = (($block->hours->total - $block->hours->from_tasks) == 0) ? true : false;
                    $block->hours->is_over = (($block->hours->total - $block->hours->from_tasks) < 0) ? true : false;


                    $block->has_tasks = true;
                    $block->tasks = $block_tasks;
                } else {
                    $block->has_tasks = false;
                    $block->tasks = [];
                }
                $i ++;
            }
        }


        if ($day_blocks) {
            system::result($day_blocks, true);
        } else {
            system::result([], true);
        }
    }

    function get($date, $user = null) {
        global $db;
        $user_id = ($user != null) ? $user : auth::get()->id;
        $db->show_query = true;
        $tables = [
            'day_blocks',
            'clients',
            'day_types'
        ];
        $fields = [
            'db.*',
            "c.name as client_name",
            'dt.label as day_type_name'
        ];


        $q = "LEFT JOIN (day_blocks db, clients c) ON db.id_client = c.id OR db.id_client IS NULL OR db.id_client = 0 OR db.id_client = 9999 "
                . "LEFT JOIN (day_types dt) ON db.id_day_type = dt.id "
                . "WHERE db.date = '$date' AND db.id_user = '$user_id' "
                . "GROUP BY db.id";

        /**
         * SELECT db . * , c.name AS client_name, dt.label AS day_type_name
          FROM  `insol_timesheet`.`day_blocks` ,  `insol_timesheet`.`clients` ,  `insol_timesheet`.`day_types`
          LEFT JOIN (
          day_blocks db, clients c
          ) ON db.id_client = c.id
          OR db.id_client IS NULL
          LEFT JOIN (
          day_types dt
          ) ON db.id_day_type = dt.id
          WHERE db.date =  '2014-11-4'
          AND db.id_user =  '7'
         */
        $day_blocks = $db->get($tables, $fields, $q);


//        echo $db->called_query;
//        exit;
//        print_r($day_blocks);
//        exit;

        if ($day_blocks) {

            $tasks = new day_tasks();
            foreach ($day_blocks as $block) {

                /**
                 * Check day type
                 */
                $block->work_day = ($block->id_day_type == '1') ? true : false;

                /**
                 * Iterate to get the all the hours worked in the active day
                 * flag for overtime
                 */
                $th = 0;
                foreach ($day_blocks as $b) {
                    $s = strtotime($b->date . ' ' . $b->start_time);
                    $e = strtotime($b->date . ' ' . $b->end_time);
                    $th = $th + (abs($s - $e) / 3600);
                }

                $block->total_worked_hours = $th;


                $start = strtotime($block->date . ' ' . $block->start_time);
                $end = strtotime($block->date . ' ' . $block->end_time);


                /**
                 * Create a new object to holds all the hours calculations
                 */
                $block->hours = new stdClass();
                $block->hours->total = abs($start - $end) / 3600;
                $block->hours->from_tasks = 0;
                $block->hours->available = $block->hours->total;
                $block->hours->is_full = false;
                $block->hours->is_over = false;
                $block->tasks = [];

                $block_tasks = $tasks->get($block->id, $user_id);
                if ($block_tasks) {

                    /**
                     * Iterate through tasks to get the hours entered
                     */
                    foreach ($block_tasks as $task) {
                        $block->hours->from_tasks = $block->hours->from_tasks + $task->hours;
                    }

                    $block->hours->available = abs($block->hours->total - $block->hours->from_tasks);
                    $block->hours->is_full = (($block->hours->total - $block->hours->from_tasks) == 0) ? true : false;
                    $block->hours->is_over = (($block->hours->total - $block->hours->from_tasks) < 0) ? true : false;


                    $block->has_tasks = true;
                    $block->tasks = $block_tasks;
                } else {
                    $block->has_tasks = false;
                    $block->tasks = [];
                }
            }


            system::result($day_blocks, true);
        } else {
            system::result([], true);
        }
    }

    function save($user_id = null) {
        global $db;
        $db->show_query = true;
        // print_r($_POST);

        $fields = [
            'date' => $db->escape($_POST['date']),
            'is_billable' => $db->escape($_POST['is_billable']),
            // check the day type to null the client id
            'id_client' => $db->escape($_POST['id_client']),
            'start_time' => $db->escape($_POST['start_time']),
            'end_time' => $db->escape($_POST['end_time']),
            'id_user' => ($user_id != null) ? $user_id : auth::get('id'),
            'id_day_type' => $db->escape($_POST['id_day_type'])
        ];


        /**
         * Check if block is overtime
         */
        $start = strtotime($fields['date'] . ' ' . $fields['start_time']);
        $end = strtotime($fields['date'] . ' ' . $fields['end_time']);
        $total = (int) $_POST['total_worked_hours'] + (abs($start - $end) / 3600);
        /**
         * overtime field bool
         */
        $fields['is_overtime'] = ($total > 8 ) ? 1 : 0;


//        print_r($fields);
//        exit;

        $result = null;
        if ($_POST['id'] > 0) {
            $result = $db->update('day_blocks', $fields, ['id' => $db->escape($_POST['id'])]);
//            echo $db->called_query;
//            exit;
        } else {
            $result = $db->insert('day_blocks', $fields);
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

//        print_r($_POST);
//        exit;

        $result = $db->delete('day_blocks', ['id' => $db->escape($_POST['id'])]);
        if ($result > 0) {

            if ($_POST['has_tasks'] == 'true') {
                
               
                $task_result = $db->delete('day_tasks', ['id_day_block' => $db->escape($_POST['id'])]);
               
                if ($task_result > 0) {
                    system::result($result);
                } else {
                    system::error('task error: ' . $result);
                }
            } else {
                system::result($result);
            }
        } else {
            system::error('block error');
        }
    }

}
