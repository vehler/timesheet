<?php

class sub_categories {

    function __construct() {
         if (!auth::is_logged()) {
            auth::re_auth();
            exit;
        }        
    }

    function get_subcategories($parameters) {
         global $db;
         
         $subcategoriaId = $parameters["id"];
         
         $get_subcategories_sql = "SELECT * FROM insol_timesheet.subcats where categoria = $subcategoriaId  and enabled = 1";
         
         $subcategories = $db->get_results($get_subcategories_sql);
         
         
         if($subcategories==null){
	         $subcategories = array(
                   'error' => true,
                   'status' => 000,
                   'menssage' => 'No Data.'
         );
	         
         }
         
     echo json_encode($subcategories); 
     
       
    }
    
    
}

?>
