'use-strict';

timesheet.components.controller('dashboard', function($scope, workdayModel, dayTypeService) {

    $scope.date = {};
    $scope.day_type = {};
    $scope.date.calendarDate = Date.today();
    $scope.date.setDate = function() {


        console.log('changed');
       // $scope.workdays = workdayModel.getWorkday($scope.date.calendarDate);

    };

    $scope.init = function() {
       // $scope.workdays = workdayModel.getWorkday($scope.date.calendarDate);
       
       dayTypeService.getAll().success(function(data){
           console.log('day types', data);
           $scope.day_type = data;
       }).error();

    };
    $scope.workdays = [1,2,3];
    $scope.tasks = [1,2,3,4,5,6,7];
    
    $scope.addWorkDay = function(){
        $scope.workdays.push($scope.workdays.length + 1);
    };
    
    $scope.addTask = function(){
        
    };
    
    $scope.init();
});