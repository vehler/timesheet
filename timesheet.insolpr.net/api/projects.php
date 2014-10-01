<?php

class projects {

    public $db;

    function __construct() {
         if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }        
    }

    function get_all_projects() {
         global $db;
         
         $get_projects_sql = "select id,id_client,name,rate,hours_assigned from insol_timesheet.projects where enabled = 1";
         
         $projects = $db->get_results($get_projects_sql);
    
     echo json_encode($projects); 
       
    }
    
    
     function get_projects_by_client($parameters) {
         global $db;
         
         $id_client = $parameters["id_client"];
        
         
         $get_projects_sql = "select id,id_client,name,rate,hours_assigned from insol_timesheet.projects where enabled = 1 and id_client = $id_client";
         
         $projects = $db->get_results($get_projects_sql);
    
     echo json_encode($projects); 
       
    }
    
    
    
}

?>
