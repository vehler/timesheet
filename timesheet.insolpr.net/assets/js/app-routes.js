'use-strict';

timesheet.config(['$routeProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

        $routeProvider.when('/dashboard', {
            templateUrl: 'pages/dashboard/home.html',
            controller: 'dashboard',
            access: 'user',
            title : 'Panel de Control',
            resolve: {
                load: ['$q', '$rootScope', function($q, $rootScope) {

                        var deferred = $q.defer();

                        require([
                            'controllers/dashboard',
                            'services/user-model',
                            'services/workday-model',
                            'services/day-type-model'

                        ], function() {

                            $rootScope.$apply(function() {
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

                .when('/super_admin/:name', {
                    templateUrl: function(urlattr) {
                        return 'pages/super_admin/' + urlattr.name + '.html';
                    },
                    controller: 'super-admin-settings',
                    access: 'superAdmin',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    'controllers/super-admin-settings',
                                    
                                            //'services/super-admin-model',
                                            //'services/admin-model',
                                            //'services/user-model',
                                            //'services/categories-model'

                                ], function() {

                                    $rootScope.$apply(function() {
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

                .when('/admin/:name', {
                    templateUrl: function(urlattr) {
                        return 'pages/admin/' + urlattr.name + '.html';
                    },
                    controller: 'adminSettings',
                    access: 'admin',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    'controllers/admin-settings',
                                    'services/settings-model',
                                    
                                            //'services/user-settings'
                                ], function() {

                                    $rootScope.$apply(function() {
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

                .when('/project_manager/:name', {
                    templateUrl: function(urlattr) {
                        return 'pages/pm/' + urlattr.name + '.html';
                    },
                    controller: 'pm-settings',
                    access: 'projectManager',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    'controllers/pm-settings',
                                    
                                            //'services/pm-services',
                                            //'services/user-settings'
                                ], function() {

                                    $rootScope.$apply(function() {
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

                .when('/user/:name/', {
                    templateUrl: function(urlattr) {
                        return 'pages/user/' + urlattr.name + '.html';
                    },
                    controller: 'user-settings',
                    access: 'user',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    'controllers/user-settings',
                                    
                                            // 'services/user-services'
                                ], function() {

                                    $rootScope.$apply(function() {
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

                .when('/report/:name/', {
                    templateUrl: function(urlattr) {
                        return 'pages/report/' + urlattr.name + '.html';
                    },
                    controller: 'reports',
                    access: 'user',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    'controllers/reports',
                                    
                                            // 'services/user-services'
                                ], function() {

                                    $rootScope.$apply(function() {
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
                    title: 'No acceso'
                })

                /******************************************************************
                 * Default
                 *****************************************************************/
                .otherwise({
                    redirectTo: '/login',
                    templateUrl: 'pages/login.html',
                    access: 'visitor',
                    title : 'Acceso',
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {

                                var deferred = $q.defer();

                                require([
                                    
                                ], function() {

                                    $rootScope.$apply(function() {
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