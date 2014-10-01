'use-strict';

timesheet.components.service('dayTypeService', function($http){
    
    this.getAll = function(){
      return $http.get('api/day_type/get_all');  
    };
    
});