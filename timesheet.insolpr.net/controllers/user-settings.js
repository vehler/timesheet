'use-strict';

timesheet.components.controller('user-settings', function ($scope, $http, $filter, growl, api) {

    $scope.loading = false;

    $scope.app.active_user = {};

    $scope.ui.clients = {};
    $scope.ui.clients.list = false;
    $scope.ui.projects = {};
    $scope.ui.projects.list = false;

    $scope.projectsFromClients = [];

    $scope.password_change = {};
    $scope.password_change = {};
    $scope.password_change.manage = function () {

    };
    $scope.password_change.do = function () {

    };



    //console.log('projects', $scope.app.projects);

    $scope.setProjectsFromClients = function (projects, user_clients) {
        console.log('app projects', projects);
        console.log('user clients', user_clients);

        $scope.projectsFromClients = [];
        angular.forEach(projects, function (project) {
            // console.log(project);
            angular.forEach(user_clients, function (client) {
                // console.log('project', project, 'client', client);

                if (project.id_client === client.id) {
                    project.client_name = client.name;

                    $scope.projectsFromClients.push(project);
                }
            });
        });

        console.log('user projects', $scope.projectsFromClients);
    };

    $scope.addClient = function (client, isValid) {

        if (isValid) {
            //$scope.loading = true;
            client.user_id = $scope.app.active_user.id;
            console.log(client);

            $http.post('api/clients/relate/', client).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {

                    $scope.set_active_user('', $scope.app.active_user);

                    var msg = ($scope.loggedUser.role < 3) ? client.name + " fue añadido a los clientes de " + $scope.app.active_user.full_name : client.name + " se añadió de mis clientes";
                    growl.addSuccessMessage(msg);

                    //$scope.active_user.clients.push(client);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
        }
    };

    $scope.removeClient = function (client) {
        console.log(client);
        //  $scope.loading = true;
        client.user_id = $scope.app.active_user.id;
        $http.post('api/clients/unrelate/', client).success(function (data) {
            console.log('response', data);

            if (data.result > 0) {
                var msg = ($scope.loggedUser.role < 3) ? client.name + " fue removido de los clientes de " + $scope.app.active_user.full_name : client.name + " fue removido de mis clientes";
                growl.addSuccessMessage(msg);

                $scope.set_active_user('', $scope.app.active_user);
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
            // $scope.getLoggedUser();
            // $scope.loading = false;
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
    };

    $scope.addProject = function (project, isValid) {

        if (isValid) {
            //  $scope.loading = true;
            project.user_id = $scope.app.active_user.id;
            console.log(project);

            $http.post('api/projects/relate/', project).success(function (data) {
                console.log('response', data);
                if (data.result > 0) {

                    var msg = ($scope.loggedUser.role < 3) ? project.name + " fue añadido a los proyectos de " + $scope.app.active_user.full_name : project.name + " se añadió de mis proyectos";
                    growl.addSuccessMessage(msg);

                    $scope.set_active_user('', $scope.app.active_user);

                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }

            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
        }
    };

    $scope.removeProject = function (project) {
        console.log(project);

        project.user_id = $scope.app.active_user.id;
        $http.post('api/projects/unrelate/', project).success(function (data) {
            console.log('response', data);

            if (data.result > 0) {

                var msg = ($scope.loggedUser.role < 3) ? project.name + " fue removido de los proyectos de " + $scope.app.active_user.full_name : project.name + " fue removido de mis proyectos";
                growl.addSuccessMessage(msg);

                $scope.set_active_user('', $scope.app.active_user);


            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }

        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
    };

    $scope.set_active_user = function (user_id, user) {

        console.log('id', user_id);
        if ($scope.loggedUser.role < 3 && user_id !== undefined && user === undefined) {

            console.log('theres and admin user present');
            $scope.app.active_user = $filter('filter')($scope.app.non_admin_users, {id: user_id})[0];
            $scope.setProjectsFromClients($scope.app.projects, user.clients);

        } else {
            console.log('regular user');


            api.users.getBy('id', user.id).then(function (user) {
                console.log('active user from db', user);
                $scope.app.active_user = user;
                $scope.setProjectsFromClients($scope.app.projects, user.clients);
            });

        }

        $scope.ui.clients.list = true;
        $scope.ui.projects.list = true;

        console.log('active user', $scope.app.active_user);
    };

    $scope.init = function () {

        //wait until the user is returned
        $scope.$watch(function (scope) {
            return scope.loggedUser;
        }, function (user) {

            console.log('watch new', user);

            if ($scope.loggedUser.role < 3) {

            } else {

                $scope.set_active_user('', user);

            }

        });
    };

    $scope.init();
});
