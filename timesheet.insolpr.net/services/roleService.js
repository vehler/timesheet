'use-strict';

timesheet.provider('roleService', function($http, $location, $log) {

    this.getAll = function() {
        return $http.get('apli/roles/get_all');
    };

});
