<?php

class categories {

    public $db;

    function __construct() {
         if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }        
    }

    function get_all_categories() {
         global $db;
         
         $get_categories_sql = "select id,name,classification from insol_timesheet.categories where enabled = 1";
         
         $categories = $db->get_results($get_categories_sql);
    
     echo json_encode($categories); 
       
    }
    
    
}
?>