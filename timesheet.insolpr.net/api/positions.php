<?php

class positions {

    public $db;

    function __construct() {
         if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }        
    }

    function get_all_positions() {
         global $db;
         
         $get_positions_sql = "select id,name from insol_timesheet.positions where enabled = 1";
         
         $positions = $db->get_results($get_positions_sql);
    
     echo json_encode($positions); 
       
    }
    
    
}

?>
