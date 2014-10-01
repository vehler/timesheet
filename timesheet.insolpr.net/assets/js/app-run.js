'use-strict';

timesheet.run(function ($rootScope, $location, $http, $log) {

    $rootScope.app = {};
    
    $rootScope.isOnline = true;
    $rootScope.isMainPage = false;
    
    $rootScope.loggedUser = {};
    $rootScope.loggedUser.fullname = 'Usuario';
    
    $rootScope.loginError = {};

    Date.CultureStrings.lang = "es-PR";

    console.log($location.path());

    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        //Change page title, based on Route information
        if (currentRoute.title !== undefined) {
            $rootScope.modifyPageTitle(currentRoute.title);
        }
    });

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        console.log($location.path());
//        if (!Auth.authorize(next.access)) {
//            if (Auth.isLoggedIn())
//                $location.path('/');
//            else
//                $location.path('/login');
//        }



//        console.log('event', event);
        console.log('next', next);
//        console.log('current', current);
    });

    $rootScope.doLogin = function (u, isValid) {
        if (isValid) {
            $http.post('api/auth/login/', u).success(function (data) {
                console.log('log in response', data);
                if (data && data.id > 0 && data.error !== true) {
                    $rootScope.isMainPage = true;
                    $rootScope.loggedUser = data;
                    $location.path('/dashboard');
                } else {
                    $rootScope.loginError = data;
                }
            }).error(function (data) {

            });
        }
    };

    $rootScope.isAdmin = function () {
        //console.log('is admin');
        if ($rootScope.loggedUser !== '' && $rootScope.loggedUser.roles !== []) {
            var is = false;
            angular.forEach($rootScope.loggedUser.roles, function (role, i) {
                //console.log('i',i);
                //console.log('role',role);
                if (role.id === 2) {
                    is = true;
                }
            });
        }
        return is;
    };

    $rootScope.isPM = function () {
        //console.log('is admin');
        if ($rootScope.loggedUser !== '' && $rootScope.loggedUser.roles !== []) {
            angular.forEach($rootScope.loggedUser.roles, function (role, i) {
                //console.log('i',i);
                //console.log('role',role);
                if (role.id === 3) {
                    return true;
                }
            });
        } else {
            return false;
        }
    };

    $rootScope.doLogout = function (u) {
        $http.post('api/auth/logout/', u).success(function (data) {
            console.log('logged out', data);
            if (data.status === 200 && data.error !== true) {
                $rootScope.loggedUser.fullname = 'Usuario';
                $rootScope.isMainPage = false;
                console.clear();
                $location.path('/login');
                $rootScope.loginError = data;
            } else {
                $rootScope.loginError = data;
            }
        }).error(function (data) {

        });
    };

    /******************************************************************
     * Get application infoÏ
     *****************************************************************/

    $rootScope.getRoles = function () {
        $http.get('api/roles/get_all/').success(function (data) {
            if (data !== '' && data.error !== true) {
                console.log('roles', data);
                $rootScope.app.roles = data;
            } else {
                $rootScope.app.roles = [];
            }
        }).error(function (data) {
            $rootScope.app.roles = [];
        });
    };

    $rootScope.getProjects = function () {
//        $http.get('api/projects/get_all/').success(function (data) {
//            if (data !== '' && data.error !== true) {
//                console.log('projects', data);
//                $rootScope.app.projects = data;
//            } else {
//                $rootScope.app.projects = [];
//            }
//        }).error(function (data) {
//            $rootScope.app.projects = [];
//        });
    };

    $rootScope.getClients = function () {
//        $http.get('api/clients/get_all/').success(function (data) {
//            if (data !== '' && data.error !== true) {
//                console.log('clients', data);
//                $rootScope.app.clients = data;
//            } else {
//                $rootScope.app.clients = [];
//            }
//        }).error(function (data) {
//            console.log('clients error', data);
//            $rootScope.app.clients = [];
//        });
    };

    $rootScope.getCategories = function () {
//        $http.get('api/categories/get_all/').success(function (data) {
//            if (data !== '' && data.error !== true) {
//                console.log('categories', data);
//                $rootScope.app.categories = data;
//            } else {
//                $rootScope.app.categories = [];
//            }
//        }).error(function (data) {
//            $rootScope.app.categories = [];
//        });
    };

    $rootScope.getSubCategories = function () {
//        $http.get('api/sub_categories/get_all/').success(function (data) {
//            if (data !== '' && data.error !== true) {
//                console.log('sub_categories', data);
//                $rootScope.app.sub_categories = data;
//            } else {
//                $rootScope.app.sub_categories = [];
//            }
//        }).error(function (data) {
//            $rootScope.app.sub_categories = [];
//        });
    };

    $rootScope.goOffiline = function () {
        $rootScope.isOnline = false;
        $rootScope.isMainPage = false;
        $location.path('/offline');
    };

    $rootScope.modifyPageTitle = function (msg) {
        $rootScope.app.pageTitle = msg !== '' ? msg + " | " + $rootScope.app.pageTitle : $rootScope.app.pageTitle;
    };

    $rootScope.init = function () {
        // console.log("init");

        /******************************************************************
         * Get settings of the application for defaults
         *****************************************************************/

        $http.get('api/settings/get_all/').success(function (data) {
            // console.log("back from getting settings", data);
            if (data && data.name !== '' && data.error !== true) {
                // console.log("aparently i have settings");
                // console.log('settings', data);
                $rootScope.app = data;
                $rootScope.app.pageTitle = data.company + " - " + data.name;
                $rootScope.getRoles();
                $rootScope.getClients();
                $rootScope.getProjects();
                $rootScope.getCategories();
                $rootScope.getSubCategories();

            } else {
                $rootScope.goOffiline();
            }
        }).error(function (data) {
            $rootScope.goOffiline();
        });


        /******************************************************************
         * Check if a user is logged and set the defaults
         *****************************************************************/

        if ($rootScope.isOnline) {
            $http.get('api/auth/get_logged/').success(function (data) {

                if (data.id > 0 && data.error !== true) {
                    //User is logged
                    console.log('user logged', data);
                    $rootScope.isMainPage = true;
                    $rootScope.loggedUser = data;
                    if ($location.path() === '/login') {
                        $location.path('/dashboard');
                    }
                } else {

                    $rootScope.returnUrl = $location.path();
                    $location.path('/login');

                }
            }).error(function (data) {
                $rootScope.goOffiline();
            });
        }
    };

    // Verifiy logged user
    // Set global variables for the application to use
    $rootScope.init();
});