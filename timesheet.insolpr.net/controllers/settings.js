'use-strict';

timesheet.controller('settings', function($scope,$http){
   
   
    $scope.clients;
    $scope.projectos;
   
   
   
   
   
$scope.getClients = function(){

     $http.get('api/clients/get_all_clients').success(function(data){
	     $scope.clients = data;  
     });
  
   };
   
   $scope.getProjectsByClient = function(){
   
	   $http.get('api/projects/get_projects_by_client?id=1').success(function(data){
	     $scope.clients = projectos;  
     });

	   
   };

     
});