'use-strict';

timesheet.components.controller('adminSettings', function($scope, settingsModel) {

    settingsModel.getAll().success(function(data) {
        $scope.appSettings = data;
        console.log(data);
    });

});