'use-strict';

timesheet.components.controller('adminSettings', function ($scope, $http, growl, api) {




    $scope.getAppSettings = function () {
        api.settings.get(true).then(function (response) {
            $scope.appSettings = response.data;
            //  console.log(data);
        });
    };



    /******************************************************************
     * Controller initialization (gets all the information needed
     * to work the administration)
     *****************************************************************/
    $scope.init = function () {

        $scope.getAppSettings();

    };

    $scope.init();
});

timesheet.components.controller('userController', function ($scope, $http, growl, api) {

    $scope.loading = false;

    $scope.password_reset = {};
    $scope.password_reset.user = {};

    $scope.password_reset.do = function (old_pass, new_pass) {

        var request = "";

        $http.get('api/auth/change_password/' + $scope.password_reset.user.id + '///true').success(function (data) {
            console.log('response', data);

            if (data.result === 1) {

                growl.addSuccessMessage("La contrase&ntilde;a de " + $scope.password_reset.user.full_name + " ha sido reinicializada");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
        $('#resetPassword').modal('hide');
    };

    $scope.password_reset.manage = function (user) {
        $scope.password_reset.user = user;

    };

    $scope.checkUsername = function (u) {
        // u.ui.loading = true;
        api.auth.checkUsername(u.username).then(function (data) {
            console.log('response', data);
            // u.ui.loading = false;
            if (data.result !== null && data.result.id > 0) {
                u.unique = false;
            } else {
                u.unique = true;
            }
        });
    };

    $scope.manageUser = function (user) {
        if (user) {

            $scope.mu = angular.copy(user);
            $scope.mu.new = false;
            $scope.mu.title = "Editando a: " + user.full_name;
            $scope.mu.btn_label = "Editar";
            $scope.mu.unique = true;

            console.log('edit user', $scope.mu);
        } else {

            $scope.mu = {};
            $scope.mu.new = true;
            $scope.mu.title = "Crear Usuario";
            $scope.mu.btn_label = "Grabar";
            $scope.mu.unique = true;

            console.log('add user', $scope.mu);
        }

    };

    $scope.saveUser = function (user, isValid) {

        if (isValid) {
            user.clients = '';
            user.projects = '';

            if (!user.phone || user.phone === "") {
                user.phone = "n/a";
            }

            if (!user.address || user.address === "") {
                user.address = "n/a";
            }

            console.log('save', user);
            $http.post('api/users/save/', user).success(function (data) {
                console.log('response', data);
                //user.ui.loading = false;
                if (data.result === 1) {
                    $scope.get.Users($scope.loggedUser);
                    var msg = (user.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(user.full_name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#manageUser').modal('hide');
        }

    };

    $scope.setUserToDelete = function (user) {
        api.users.remove.set(user);
        $scope.userToBeDeleted = user;
    };

    $scope.deleteUser = function () {
        // console.log('delete', $scope.userToBeDeleted);

        api.users.remove.do().then(function (data) {
            console.log('response', data);
            //  $scope.userToBeDeleted.ui.loading = false;
            if (data.result > 0) {
                $scope.get.Users($scope.loggedUser);
                growl.addSuccessMessage($scope.userToBeDeleted.full_name + " ha sido eliminado");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        });

        $('#confirmDelete').modal('hide');
    };

    $scope.toggleEnable = function (user, index) {
        user.ui.loading = true;
        console.log('toggle active', user);
        api.users.toggleEnable(user.id, user.enabled).then(function (data) {
            console.log('response', data);
            user.ui.loading = false;
            if (data.result === 1) {
                if (data.enabled === 1) {
                    $scope.app.users[index].enabled = data.enabled;
                    $scope.app.users[index].ui.active_label = "Activo";
                    $scope.app.users[index].ui.active_class = "btn-success";
                    growl.addSuccessMessage(user.full_name + " ha sido activado");
                } else {
                    $scope.app.users[index].enabled = data.enabled;
                    $scope.app.users[index].ui.active_label = "Inactivo";
                    $scope.app.users[index].ui.active_class = "btn-danger";
                    growl.addSuccessMessage(user.full_name + " ha sido desactivado");
                }
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
    };

});

timesheet.components.controller('clientController', function ($scope, $http, growl) {


    $scope.manage = function (client) {
        if (client) {

            $scope.managed_client = angular.copy(client);
            $scope.managed_client.new = false;
            $scope.managed_client.title = "Editando a: " + client.name;
            $scope.managed_client.btn_label = "Editar";


            console.log('edit client', $scope.managed_client);
        } else {

            $scope.managed_client = {};
            $scope.managed_client.new = true;
            $scope.managed_client.title = "Crear Cliente";
            $scope.managed_client.btn_label = "Grabar";

            console.log('add client', $scope.managed_client);
        }

    };

    $scope.save = function (client, isValid) {

        if (isValid) {

            if (client.address === '') {
                client.address = "n/a";
            }
            if (client.phone === '') {
                client.phone = "n/a";
            }
            if (client.description === '') {
                client.description = "n/a";
            }
            if (client.contact_person === '') {
                client.contact_person = "n/a";
            }

            console.log('save', client);
            $http.post('api/clients/save/', client).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {
                    $scope.get.Clients();
                    var msg = (client.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(client.name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#manage').modal('hide');
        }

    };

    $scope.setToDelete = function (client) {
        $scope.toBeDeleted = client;
    };

    $scope.delete = function () {
        console.log('delete', $scope.toBeDeleted);

        $http.post('api/clients/delete/', {id: $scope.toBeDeleted.id}).success(function (data) {
            console.log('response', data);

            if (data.result === 1) {
                $scope.get.Clients();
                growl.addSuccessMessage($scope.toBeDeleted.name + " ha sido eliminado");

            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });

        $('#confirmDelete').modal('hide');
    };

    $scope.toggleEnable = function (client, index) {
        client.ui.loading = true;
        console.log('toggle active', client);
        $http.post('api/clients/enable/', {id: client.id, enabled: client.enabled}).success(function (data) {
            console.log('response', data);
            client.ui.loading = false;

            if (data.result > 0) {
                if (data.enabled === 1) {
                    $scope.app.clients[index].enabled = data.enabled;
                    $scope.app.clients[index].ui.active_label = "Activo";
                    $scope.app.clients[index].ui.active_class = "btn-success";
                    growl.addSuccessMessage(client.name + " ha sido activado");
                } else {
                    $scope.app.clients[index].enabled = data.enabled;
                    $scope.app.clients[index].ui.active_label = "Inactivo";
                    $scope.app.clients[index].ui.active_class = "btn-danger";
                    growl.addSuccessMessage(client.name + " ha sido desactivado");
                }
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
    };

});

timesheet.components.controller('projectController', function ($scope, $http, growl, api) {

    $scope.mp = {};
    $scope.toBeDeleted = {};

    $scope.manage = function (project) {
        if (project) {

            $scope.mp = angular.copy(project);
            $scope.mp.new = false;
            $scope.mp.title = "Editando a: " + project.name;
            $scope.mp.btn_label = "Editar";


            console.log('edit project', $scope.mp);
        } else {

            $scope.mp = {};
            $scope.mp.new = true;
            $scope.mp.title = "Crear Projecto";
            $scope.mp.btn_label = "Grabar";

            console.log('add project', $scope.mp);
        }

    };

    $scope.save = function (project, isValid) {

        if (isValid) {

            console.log('save project', project);
            $http.post('api/project_parents/save/', project).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {
                    $scope.get.ProjectParents();

                    /******************************************************************
                     * create a sub project by default
                     *****************************************************************/
                    project.id = data.id;
                    $scope.subManage(project);

                    $scope.sub.name = project.name;

                    $scope.subSave($scope.sub, true);

                    var msg = (project.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(project.name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#manage').modal('hide');
        }

    };

    $scope.setToDelete = function (project) {
        console.log('to be deleted', project);
        $scope.toBeDeleted = project;
    };

    $scope.delete = function () {
        console.log('delete project', $scope.subToBeDeleted);

        $http.post('api/project_parents/delete/', {id: $scope.subToBeDeleted.id}).success(function (data) {
            console.log('response', data);

            if (data.result === 1) {


                /******************************************************************
                 * delete sub projects
                 *****************************************************************/

                //TODO delete sub projects


                $scope.get.ProjectParents();


                growl.addSuccessMessage($scope.subToBeDeleted.project_name + " ha sido eliminado");
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

    $scope.sub = {};
    $scope.subToBeDeleted = {};

    $scope.subManage = function (parent, subProject) {

        $scope.sub = {};
        $scope.sub.id_client = parent.client_id;
        $scope.sub.parent_project_id = parent.id;

        if (subProject) {

            $scope.sub = angular.copy(subProject);
            $scope.sub.new = false;
            $scope.sub.title = "Editando a: " + subProject.name;
            $scope.sub.btn_label = "Editar";


            console.log('edit sub project', $scope.sub);
        } else {


            $scope.sub.new = true;
            $scope.sub.title = "Crear un Sub-Projecto para: " + parent.name;
            $scope.sub.btn_label = "Grabar";
            $scope.sub.is_deliverable = 1;

            console.log('add sub project', $scope.sub);
        }

    };

    $scope.subSave = function (subProject, isValid) {

        if (isValid) {

            if (subProject.description === "") {
                subProject.description = "n/a";
            }
            if (subProject.contact_person === "") {
                subProject.contact_person = "n/a";
            }
            if (subProject.hours_assigned === "") {
                subProject.hours_assigned = 0;
            }

            console.log('save sub project', subProject);
            $http.post('api/projects/save/', subProject).success(function (data) {
                console.log('response', data);

                if (data.result > 0) {
                    $scope.get.Projects();
                    var msg = (subProject.new) ? " ha sido creado" : " ha sido editado";
                    growl.addSuccessMessage(subProject.name + msg);
                } else {
                    growl.addWarnMessage($scope.msg.generalError);
                }
            }).error(function () {
                growl.addWarnMessage($scope.msg.generalError);
            });
            $('#subManage').modal('hide');
        }

    };

    $scope.subSetToDelete = function (subProject) {
        console.log('to be deleted', subProject);
        $scope.subToBeDeleted = subProject;
    };

    $scope.subDelete = function () {
        console.log('delete project', $scope.subToBeDeleted);

        $http.post('api/projects/delete/', {id: $scope.subToBeDeleted.id}).success(function (data) {
            console.log('response', data);

            if (data.result === 1) {
                $scope.get.Projects();
                growl.addSuccessMessage($scope.subToBeDeleted.name + " ha sido eliminado");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });

        $('#subConfirmDelete').modal('hide');
    };

    /******************************************************************
     * sub Project Rates
     *****************************************************************/



});