'use-strict';

(function () {

    timesheet.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            $routeProvider

                    /******************************************************************
                     * Default page for user (alias: calendary view)
                     *****************************************************************/

                    .when('/dashboard/:sub_page?/:id?', {
                        templateUrl: 'pages/dashboard/index.html',
                        controller: 'dashboard',
                        reloadOnSearch: false,
                        access: 'user',
                        title: 'Panel de Control',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/dashboard'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }
                    })

                    /******************************************************************
                     * Super Admin Pages
                     *****************************************************************/

                    .when('/super_admin/:sub_page?/:id?', {
                        templateUrl: 'pages/super_admin/index.html',
                        controller: 'super-admin-settings',
                        access: 'superAdmin',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/super-admin-settings'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }

                    })

                    /******************************************************************
                     * Admin Pages
                     *****************************************************************/

                    .when('/admin/:sub_page?/:id?', {
                        templateUrl: 'pages/admin/index.html',
                        controller: 'adminSettings',
                        access: 'admin',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/admin-settings'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }
                    })


                    /******************************************************************
                     * Project Manager Pages
                     *****************************************************************/

                    .when('/project_manager/:sub_page?/:id?', {
                        templateUrl: 'pages/pm/index.html',
                        controller: 'projectManager',
                        access: 'projectManager',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/pm-settings',
                                                //'services/pm-services',
                                                //'services/user-settings'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }

                    })


                    /******************************************************************
                     * User Pages
                     *****************************************************************/

                    .when('/user/:sub_page?/:id?', {
                        templateUrl: 'pages/user/index.html',
                        controller: 'user-settings',
                        access: 'user',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/user-settings'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }
                    })


                    /******************************************************************
                     * Report Pages
                     *****************************************************************/

                    .when('/reports/consultant', {
                        templateUrl: 'pages/reports/consultant.html',
                        controller: 'reports',
                        access: ['user', 'manager'],
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/reports',
                                                // 'services/user-services'
                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }
                    })

                    .when('/reports/admin', {
                        templateUrl: 'pages/reports/admin.html',
                        controller: 'reports',
                        access: ['admin'],
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        'controllers/reports'

                                    ], function () {

                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });

                                    return deferred.promise;
                                }]
                        }
                    })

                    /******************************************************************
                     * Offline - when theres no connection to the database
                     *****************************************************************/

                    .when('/offline', {
                        templateUrl: 'pages/offline.html',
                        access: 'visitor',
                    })

                    /******************************************************************
                     * Default
                     *****************************************************************/

                    .otherwise({
                        redirectTo: '/login',
                        templateUrl: 'pages/login.html',
                        access: 'visitor',
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                    var deferred = $q.defer();

                                    require([
                                        
                                    ], function () {
                                        $rootScope.$apply(function () {
                                            deferred.resolve();
                                        });

                                    });
                                    
                                    return deferred.promise;
                                }]
                        }
                    });


            //store a reference to various provider functions
            timesheet.components = {
                controller: $controllerProvider.register,
                service: $provide.service
            };

        }]);


})();
