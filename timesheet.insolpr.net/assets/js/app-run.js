'use-strict';

timesheet.run([
    '$rootScope',
    '$location',
    '$routeParams',
    '$window',
    '$route',
    '$q',
    '$filter',
    '$timeout',
    'growl',
    'api',
    function ($rootScope, $location, $routeParams, $window, $route, $q, $filter, $timeout, growl, api) {

        $rootScope.app = {};
        $rootScope.app.users = {};
        $rootScope.app.clients = {};
        $rootScope.app.projects = {};
        $rootScope.app.project_parents = {};
        $rootScope.app.categories = {};
        $rootScope.app.day_types = {};
        $rootScope.app.roles = {};
        $rootScope.app.sub_categories = {};
        $rootScope.app.settings = {};
        $rootScope.app.active_user = {};
        $rootScope.app.is_resetted = true;

        $rootScope.get = {};

        $rootScope.get.Users = function (logged) {
            api.users.get(logged.id).then(function (users) {
                console.log(users);
                $rootScope.app.users = users;
            });
        };
        $rootScope.get.Clients = function () {
            api.clients.get().then(function (clients) {
                $rootScope.app.clients = clients;
            });
        };
        $rootScope.get.Projects = function () {
            api.projects.get().then(function (projects) {
                $rootScope.app.projects = projects;
            });
        };
        $rootScope.get.ProjectParents = function () {
            api.projectParents.get().then(function (projectParents) {
                $rootScope.app.project_parents = projectParents;
            });
        };
        $rootScope.get.Categories = function () {
            api.categories.get().then(function (categories) {
                $rootScope.app.categories = categories;
            });
        };
//        $rootScope.get.DayTypes = function () {
//            api.dayTypes.get().then(function (dayTypes) {
//                $rootScope.app.day_types = dayTypes;
//            });
//        };
//        $rootScope.get.Roles = function () {
//            api.roles.get().then(function (roles) {
//                $rootScope.app.roles = roles;
//            });
//        };
        $rootScope.get.SubCategories = function () {
            api.subCategories.get().then(function (subCategories) {
                $rootScope.app.sub_categories = subCategories;
            });
        };
//        $rootScope.get.Settings = function () {
//            api.settings.get().then(function (settings) {
//                $rootScope.app.settings = settings;
//            });
//        };

        $rootScope.get.ActiveUser = function (logged, userId, callback) {
            var au = api.auth.activeUser(logged, userId, $rootScope.app.users, callback);
            $rootScope.app.active_user = au.user;
        };


        /******************************************************************
         * Application Variables
         *****************************************************************/

        $rootScope.isOnline = true;

        /******************************************************************
         * User Interfase / Animations **buggy
         *****************************************************************/

        $rootScope.ui = {};
        $rootScope.ui.notifications = {};

        $rootScope.ui.isMain = false;

        $rootScope.ui.login = {};
        $rootScope.ui.login.button = 'Iniciar Sesi&oacute;n';
        $rootScope.ui.login.processing = false;
        $rootScope.ui.login.success = false;


        /******************************************************************
         * Logged User Object ( contains all infor needed to run the app
         *****************************************************************/

        $rootScope.loggedUser = {};
        $rootScope.loginError = {};

        /******************************************************************
         * Application Messages
         *****************************************************************/

        $rootScope.msg = {};
        $rootScope.msg.generalError = "Lo sentimos, hubo un error de comunicación. Por favor inténtelo más tarde.";

        /******************************************************************
         * Application filer Wrappers
         *****************************************************************/

        $rootScope.date_filter = $filter('date');
        $rootScope.filter = $filter('filter');

        /******************************************************************
         * Route verification and modifications if needed
         *****************************************************************/

        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {


        });
        $rootScope.$on("$routeChangeStart", function (event, next, current) {

            if (!$rootScope.loggedUser) {
                $location.path('/login');
            }
//            if (next.access !== null && !$rootScope.loggedUser.role_name === next.access)
//            {
//                $location.path('/no_access');
//            }
        });
        /******************************************************************
         * User authentication and identification
         *****************************************************************/

        $rootScope.doLogin = function (u, isValid) {
            $rootScope.loginError = {};
            $rootScope.ui.login.processing = true;

            if (isValid) {
                api.auth.login(u).then(function (data) {
                    console.log('Logged User:', data);
                    if (data && data.id > 0) {
                        $rootScope.ui.login.button = 'Autenticado';
                        $rootScope.ui.login.processing = false;
                        $rootScope.ui.login.success = true;
                        $timeout(function () {
                            $rootScope.init();
                            growl.addSuccessMessage(data.full_name + ' ha sido autenticado exitosamente');
                        }, 800);
                    } else {
                        $rootScope.ui.login.processing = false;
                        $rootScope.loginError = data;
                    }
                }).then(function (data) {
                    //  $rootScope.loginError = data;
                });
            }
        };

        $rootScope.doLogout = function (u) {
            $rootScope.ui.login.success = false;
            $rootScope.ui.isMain = false;

            api.auth.logout(u).then(function (data) {
                console.log('logged out', data);
                if (data.status === 200 && data.error !== true) {
                    console.clear();
                    $location.path('/login');
                } else {
                    $rootScope.loginError = data;
                }
            }, function (data) {
                //$rootScope.loginError = data;
            });
        };
        $rootScope.userIs = function (roleName) {
            //console.log('role name', roleName);
            //console.log('user role', $rootScope.loggedUser.role);
            if ($rootScope.loggedUser !== '' && $rootScope.loggedUser.role !== undefined) {

                if ($rootScope.loggedUser.role_name.toLowerCase() === roleName.toLowerCase()) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
        $rootScope.userIsNot = function (roleName) {
            return ($rootScope.userIs(roleName)) ? false : true;
        };
        /******************************************************************
         * Navigation
         *****************************************************************/

        $rootScope.goHome = function () {

            /******************************************************************
             * Redirect to change password id the administration has reset his password
             *****************************************************************/
            // console.log('this shit', $rootScope.loggedUser.is_reset);
            if ($rootScope.loggedUser.is_reset === "1") {

                $location.path('/user/change_password');
            } else {

                if ($rootScope.userIs('admin') || $rootScope.userIs('super_admin')) {
                    $location.path('/admin');
                } else {
                    $location.path('/dashboard');
                }
            }

        };

        $rootScope.goBack = function () {
            $window.history.back();
        };

        $rootScope.goOffline = function () {
            $rootScope.isOnline = false;
            $rootScope.ui.isMain = false;
            $location.path('/login');
        };

        $rootScope.subPage = function (defaultPage) {
            if ($routeParams.sub_page !== undefined) {
                return $routeParams.sub_page;
            } else {
                if (defaultPage !== undefined) {
                    return defaultPage;
                } else {
                    return 'menu';
                }
            }

        };

        $rootScope.reloadRoute = function () {
            $route.reload();
        }

        /******************************************************************
         * Application init
         *****************************************************************/

        $rootScope.init = function () {


            /******************************************************************
             * Get the data of the application
             *****************************************************************/

            var applicationData = [];

            applicationData.push(api.auth.getLogged());
            applicationData.push(api.settings.get());
            applicationData.push(api.roles.get());
            applicationData.push(api.clients.get());
            applicationData.push(api.projects.get());
            applicationData.push(api.projectParents.get());
            applicationData.push(api.categories.get());
            applicationData.push(api.subCategories.get());
            applicationData.push(api.dayTypes.get());

            $q.all(applicationData).then(function (response) {

                //console.log('all data response', response);
                /******************************************************************
                 * Set the data of the application
                 *****************************************************************/

                $rootScope.app = response[1];
                $rootScope.app.roles = response[2];
                $rootScope.app.clients = response[3];
                $rootScope.app.projects = response[4];
                $rootScope.app.project_parents = response[5];
                $rootScope.app.categories = response[6];
                $rootScope.app.sub_categories = response[7];
                $rootScope.app.day_types = response[8];


                // console.log(response[0].data);
                /******************************************************************
                 * Check if a user is logged in
                 *****************************************************************/

                if (response[0].id > 0) {

                    $rootScope.loggedUser = response[0];


                    /******************************************************************
                     * If trying to get to the login redirect to the role based home
                     *****************************************************************/

                    if ($location.path() === '/login') {
                        $rootScope.goHome();
                    }

                    /******************************************************************
                     * Set properties to set defaults, views and misc
                     *****************************************************************/

                    $rootScope.isOnline = true;
                    $rootScope.ui.isMain = true;

                    /******************************************************************
                     * If the user is an admin load other user to manage
                     *****************************************************************/

                    if ($rootScope.loggedUser.role < 3) {

                        api.users.get($rootScope.loggedUser).then(function (users) {
                            $rootScope.app.users = users;
                        });
                    }

                    /******************************************************************
                     * Set the active user for the application
                     *****************************************************************/


                    $rootScope.app.active_user = api.auth.activeUser($rootScope.loggedUser).user;
//                    $rootScope.get.ActiveUser($rootScope.loggedUser, null, function (active) {
//                        console.log('fuck yeah?', active);
//                        $rootScope.app.active_user = active.user;
//                    });

                } else {

                    /******************************************************************
                     * No user is logged
                     * Go to login
                     *****************************************************************/

                    $rootScope.goOffline();

                }

            }).catch(function (error) {

                /******************************************************************
                 * Error ocurred looking for data
                 * No user is logged
                 * Go to login
                 *****************************************************************/

                $rootScope.goOffline();
            });
        };

        $rootScope.init();

    }]);