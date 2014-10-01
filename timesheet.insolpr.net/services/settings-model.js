'use-strict';

timesheet.components.service('settingsModel', function($http) {

    this.getAll = function() {
        return $http.get('api/settings/get_all/?raw=true');
    };
});