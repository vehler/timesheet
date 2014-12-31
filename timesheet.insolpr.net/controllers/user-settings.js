'use-strict';

timesheet.components.controller('user-settings', function ($scope, $http, $filter, $timeout, $location, growl, api) {

    $scope.loading = false;

    $scope.app.active_user = {};

    $scope.ui.clients = {};
    $scope.ui.clients.list = false;
    $scope.ui.projects = {};
    $scope.ui.projects.list = false;

    $scope.projectsFromClients = [];

    $scope.changePassword = function (pw, isValid) {

        if (isValid) {
            if (pw.pass !== undefined && pw.pass !== '' && pw.repeat_pass !== undefined && pw.repeat_pass !== '') {

                var id = $scope.app.active_user.id;
                console.log('active user id', id);
                console.log('passwords', pw);
                // return;

                api.auth.changePassword.do(id, pw.pass, pw.old_pass, false).then(function (response) {

                    console.log('change pass', response);

                    if (response.result > 0)
                    {

                        growl.addSuccessMessage('Su contrase&ntilde;a ha sido actualizada');
                        $scope.loggedUser.is_reset = 0;

                        $timeout(function () {
                            $scope.reloadRoute();
                            $location.path('/dashboard');
                        }, 800);
                        // $scope.change_password.$pristine();
                    } else {
                        growl.addWarnMessage($scope.msg.generalError);
                        // $scope.change_password.$pristine();
                    }

                });
            }
        }
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
            console.log('save project', project);

            $http.post('api/projects/relate/', project).success(function (data) {
                console.log('save project response', data);
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
            $scope.app.active_user = $filter('filter')($scope.app.users, {id: user_id})[0];
            $scope.setProjectsFromClients($scope.app.projects, $scope.app.active_user.clients);

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


        console.log('init de projects', $scope.loggedUser);

        $scope.$watch(function (scope) {
            return scope.loggedUser;
        }, function (user) {

            console.log('watch new', user);

            if ($scope.loggedUser.role < 3) {

                // $scope.get.Users($scope.loggedUser);

                if ($location.path() == '/user/change_password') {
                    $scope.set_active_user('', $scope.loggedUser);
                }


            } else {

                $scope.set_active_user('', user);

            }

        });
    };

    $scope.init();
});

timesheet.components.controller('categoryController', function ($scope, $http, $filter, growl, api) {

    $scope.managed_cat = {};
    $scope.toBeDeleted = {};

    $scope.manage = function (category) {
        if (category) {

            $scope.managed_cat = angular.copy(category);
            $scope.managed_cat.new = false;
            $scope.managed_cat.title = "Editando: " + category.name;
            $scope.managed_cat.btn_label = "Editar";


            console.log('edit project', $scope.managed_cat);
        } else {

            $scope.managed_cat = {};
            $scope.managed_cat.new = true;
            $scope.managed_cat.title = "Crear Categor&iacute;a";
            $scope.managed_cat.btn_label = "Grabar";

            console.log('add project', $scope.managed_cat);
        }

    };

    $scope.save = function (cat, isValid) {

        if (isValid) {

            console.log('save cat', cat);
            $http.post('api/categories/save/', cat).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {
                    $scope.get.Categories();


                    var msg = (cat.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(cat.name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#manage').modal('hide');
        }

    };

    $scope.setToDelete = function (cat) {
        console.log('to be deleted', cat);
        $scope.toBeDeleted = cat;
    };

    $scope.delete = function () {
        console.log('delete cat', $scope.subToBeDeleted);

        $http.post('api/categories/delete/', {id: $scope.subToBeDeleted.id}).success(function (data) {
            console.log('cat response', data);

            if (data.result === 1) {


                /******************************************************************
                 * delete sub projects
                 *****************************************************************/

                //TODO delete sub projects


                $scope.get.Categories();
                $scope.get.SubCategories();


                growl.addSuccessMessage($scope.subToBeDeleted.name + " ha sido eliminado");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });

        $('#confirmDelete').modal('hide');
    };

    /******************************************************************
     * Sub Projects
     *****************************************************************/

    $scope.subCat = {};
    $scope.subToBeDeleted = {};

    $scope.subManage = function (parent, subCat) {

        $scope.subCat = {};
        $scope.subCat.id_category = parent.id;


        if (subCat) {

            $scope.subCat = angular.copy(subCat);
            $scope.subCat.new = false;
            $scope.subCat.title = "Editando a: " + $filter('limitTo')(subCat.name, 50) + '...';
            $scope.subCat.btn_label = "Editar";


            console.log('edit sub cat', $scope.subCat);
        } else {


            $scope.subCat.new = true;
            $scope.subCat.title = "Crear una Sub-Categor&iacute;a para: " + parent.name;
            $scope.subCat.btn_label = "Grabar";


            console.log('add sub cat', $scope.subCat);
        }

    };

    $scope.subSave = function (subCat, isValid) {

        if (isValid) {

            console.log('save sub project', subCat);
            $http.post('api/sub_categories/save/', subCat).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {
                    $scope.get.Categories();
                    $scope.get.SubCategories();
                    var msg = (subCat.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(subCat.name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#subManage').modal('hide');
        }

    };

    $scope.subSetToDelete = function (subCat) {
        console.log('to be deleted', subCat);
        $scope.subToBeDeleted = subCat;
    };

    $scope.subDelete = function () {
        console.log('delete sub cat', $scope.subToBeDeleted);

        $http.post('api/sub_categories/delete/', {id: $scope.subToBeDeleted.id}).success(function (data) {
            console.log('sub response', data);

            if (data.result === 1) {
                $scope.get.Categories();
                $scope.get.SubCategories();
                growl.addSuccessMessage($scope.subToBeDeleted.name + " ha sido eliminado");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });

        $('#subConfirmDelete').modal('hide');
    };

});