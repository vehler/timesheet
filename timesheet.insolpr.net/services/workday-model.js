'use-strict';

timesheet.components.service('workdayModel', function($http) {

    this.getWorkday = function(date) {
        return $http.get('api/workdays/get/?date=' + date.toString("yyyy-MM-dd"));
    };
});