<?php

class clients {

    public $db;

    function __construct() {
         if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }        
    }

    function get_all_clients() {
         global $db;
         
         $get_clients_sql = "select id, name  from insol_timesheet.clients where enabled = 1";
         
         $clients = $db->get_results($get_clients_sql);
    
     echo json_encode($clients); 
       
    }
    
    function get_clients_by_user() {
         global $db;
         
         $get_clients_sql = "select id, name  from insol_timesheet.clients where enabled = 1";
         
         $clients = $db->get_results($get_clients_sql);
    
     echo json_encode($clients); 
       
    }
    
    
}

?>
