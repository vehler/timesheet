'use-strict';

var timesheet = angular.module("timesheet",
        ['ngSanitize', 'ngRoute', 'ngAnimate', 'ngCookies', 'ui.bootstrap', 'angular-growl', 'timesheet.models'],
        function ($httpProvider)
        {
            // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function (data)
                {
                    /**
                     * The workhorse; converts an object to x-www-form-urlencoded serialization.
                     * @param {Object} obj
                     * @return {String}
                     */
                    var param = function (obj)
                    {
                        var query = '',
                                name,
                                value,
                                fullSubName,
                                subName,
                                subValue,
                                innerObj,
                                i;

                        for (name in obj)
                        {
                            value = obj[name];

                            if (value instanceof Array)
                            {
                                for (i = 0; i < value.length; ++i)
                                {
                                    subValue = value[i];
                                    fullSubName = name + '[' + i + ']';
                                    innerObj = {};
                                    innerObj[fullSubName] = subValue;
                                    query += param(innerObj) + '&';
                                }
                            }
                            else if (value instanceof Object)
                            {
                                for (subName in value)
                                {
                                    subValue = value[subName];
                                    fullSubName = name + '[' + subName + ']';
                                    innerObj = {};
                                    innerObj[fullSubName] = subValue;
                                    query += param(innerObj) + '&';
                                }
                            }
                            else if (value !== undefined && value !== null)
                            {
                                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                            }
                        }

                        return query.length ? query.substr(0, query.length - 1) : query;
                    };

                    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                }];
        });

timesheet.config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {
                if (config.method === 'GET' || config.method === 'POST') {

                    // console.log('angular config', config);

//                    if (config.url.indexOf('api') !== -1) {
//                        var sep = config.url.indexOf('?') === -1 ? '?' : '&';
//                        config.url = config.url + sep + 'nocache=' + new Date().getTime();
//                    }
                }
                // console.log(config.url);
                return config || $q.when(config);
            }
        };
    });

});

timesheet.config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalEnableHtml(true);
    }]);


