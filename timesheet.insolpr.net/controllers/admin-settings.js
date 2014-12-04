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
        u.ui.loading = true;
        api.auth.checkUsername(u.username).then(function (data) {
            console.log('response', data);
            u.ui.loading = false;
            if (data.result === '1') {

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
                user.ui.loading = false;
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
    };

    $scope.deleteUser = function () {
        // console.log('delete', $scope.userToBeDeleted);

        api.users.remove.do().then(function (data) {
            console.log('response', data);
            //  $scope.userToBeDeleted.ui.loading = false;
            if (data.result === 1) {
                $scope.get.Users($scope.loggedUser);
                growl.addSuccessMessage($scope.userToBeDeleted.full_name + " ha sido eliminado");
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
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


    angular.forEach($scope.app.clients, function (client, index) {

        if (client.enabled === '1') {
            client.ui.active_label = "Activo";
            client.ui.active_class = "btn-success";
        } else {
            client.ui.active_label = "Inactivo";
            client.ui.active_class = "btn-danger";
        }

    });


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

            console.log('save', client);
            $http.post('api/clients/save/', client).then(function (data) {
                console.log('response', data);

                if (data.result === 1) {
                    $scope.getAppUsers();
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

                growl.addSuccessMessage($scope.toBeDeleted.name + " ha sido eliminado");
                $scope.app.clients.splice($scope.app.clients.indexOf($scope.toBeDeleted), 1);

            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });

        $('#confirmDelete').modal('hide');
    };

    $scope.toggleEnable = function (client, index) {
        client.loading = true;
        console.log('toggle active', client);
        $http.post('api/users/enable/', {id: client.id, enabled: client.enabled}).success(function (data) {
            console.log('response', data);
            client.loading = false;
            if (data.result === 1) {
                if (data.enabled === 1) {
                    $scope.app.clients[index].enabled = data.enabled;
                    $scope.app.clients[index].active_label = "Activo";
                    $scope.app.clients[index].active_class = "btn-success";
                    growl.addSuccessMessage(client.full_name + " ha sido activado");
                } else {
                    $scope.app.clients[index].enabled = data.enabled;
                    $scope.app.clients[index].active_label = "Inactivo";
                    $scope.app.clients[index].active_class = "btn-danger";
                    growl.addSuccessMessage(client.full_name + " ha sido desactivado");
                }
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function () {
            growl.addWarnMessage($scope.msg.generalError);
        });
    };

});

timesheet.components.controller('projectController', function ($scope, growl, api) {


});