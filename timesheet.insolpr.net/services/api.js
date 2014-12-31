'use-strict';

angular.module('timesheet.models', [])
        .service('apiBase', function ($http, $q) {
            this.get = function (url, transformCallBack) {

                // setup defered object
                var deferred = $q.defer();

                // console.log('apiBase GET URL :', 'api/' + url);
                //make ajax call
                $http.get('api/' + url)

                        .success(function (data) {

                            //if theres a function to transform
                            //the data run it
                            if (transformCallBack !== undefined) {
                                data = transformCallBack(data);
                            }

                            //    console.log('apiBase data from GET: ' + url, data);
                            //set data promise
                            deferred.resolve(data);

                        }).error(function (error) {

                    //if theres an error
                    //reject promise
                    deferred.reject(error);
                });

                //return the promise
                return deferred.promise;
            };
            this.post = function (url, data, transformCallBack) {

                // setup defered object
                var deferred = $q.defer();

                // console.log('apiBase POST URL :', 'api/' + url);
                //make ajax call
                $http.post('api/' + url, data)

                        .success(function (data) {

                            //if theres a function to transform
                            //the data run it
                            if (transformCallBack !== undefined) {
                                data = transformCallBack(data);
                            }

                            //   console.log('apiBase data from POST: ' + url, data);

                            //set data promise
                            deferred.resolve(data);

                        }).error(function (error) {

                    //if theres an error
                    //reject promise
                    deferred.reject(error);
                });

                //return the promise
                return deferred.promise;
            };
        })

        .service('api', function ($http, $filter, apiBase) {

            var self = this;
            /******************************************************************
             * Auth
             *****************************************************************/

            this.auth = {
                login: function (user) {
                    return apiBase.post('auth/login', user, function (data) {
                        return data;
                    });
                },
                logout: function (user) {
                    return apiBase.post('auth/logout', user, function (data) {
                        return data;
                    });
                },
                getLogged: function () {
                    return apiBase.get('auth/get_logged', function (data) {
                        return data;
                    });
                },
                changePassword: {
                    do: function (id, newPassword, oldPassword, isAutomated) {

                        console.log('CP from api', id, newPassword, oldPassword, isAutomated);

                        if (isAutomated) {
                            return apiBase.get('auth/change_password/' + id + '///true', function (data) {
                                return data;
                            });
                            //$http.get('api/auth/change_password/);
                        } else {
                            if (newPassword !== undefined && newPassword !== "" && oldPassword !== undefined && oldPassword !== '') {

                                var request = id + '/' + newPassword + '/' + oldPassword + '/false';

                                return apiBase.get('auth/change_password/' + request, function (data) {
                                    return data;
                                });
                                //return $http.get('api/auth/change_password/' + request);
                            }
                        }
                    }
                },
                userIs: function () {
                },
                userIsNot: function () {
                },
                checkUsername: function (username) {
                    if (username !== undefined && username !== '') {
                        return apiBase.get('users/check/username/' + username, function (data) {

                            return data;
                        });
                    }
                },
                activeUser: function (loggedUser, userId, appUsers, callBack) {
                    var active = {};
                    active.isAdmin = false;
                    active.hasUser = false;
                    if (loggedUser.role < 3) {

                        if (userId !== undefined) {
                            active.user = $filter('filter')(appUsers, {id: userId})[0];
                            active.isAdmin = true;
                            active.hasUser = true;

                            if (callBack !== undefined) {
                                callBack(active);
                            }
                            console.log(loggedUser.username + ' is using:', active);
                        } else {


                            self.users.getBy('id', loggedUser.id).then(function (user) {
                                active.user = user;
                                active.isAdmin = true;

                                if (callBack !== undefined) {
                                    callBack(active);
                                }
                            });

                            console.log(loggedUser.username + ' is active but theres no user present');
                        }

                    } else {

                        self.users.getBy('id', loggedUser.id).then(function (user) {

                            active.user = user;

                            if (callBack !== undefined) {
                                callBack(active);
                            }
                        });
                        console.log('active user', active);
                    }

                    return active;
                }
            };

            /******************************************************************
             * Users
             *****************************************************************/

            this.users = {
                get: function (loggedId) {
                    //debugger;
                    return apiBase.get('users/get_all', function (data) {
                        angular.forEach(data, function (user, index) {

                            user.ui = {};
                            user.ui.loading = false;
                            user.unique = true;


                            if (loggedId !== undefined) {
                                if (user.id === loggedId) {
                                    user.ui.no_change = true;
                                } else {
                                    user.ui.no_change = false;
                                }
                            }

                            if (user.enabled === '1') {
                                user.ui.active_label = "Activo";
                                user.ui.active_class = "btn-success";
                            } else {
                                user.ui.active_label = "Inactivo";
                                user.ui.active_class = "btn-danger";
                            }
                            if (user.is_contract === '0') {
                                user.ui.contract_label = "Empleado Regular";
                            } else {
                                user.ui.contract_label = "Servicios Profesionales";

                            }

                        });
                        return data;
                    });
                },
                getOne: function () {

                },
                getBy: function (field, val) {

                    return apiBase.get('users/get_by/' + field + '/' + val, function (data) {
                        return data;
                    });

                },
                save: {
                    toBeSaved: {},
                    set: function (user) {
                        if (user) {

                            this.toBeSaved = angular.copy(user);
                            this.toBeSaved.ui.new = false;
                            this.toBeSaved.ui.title = "Editando a: " + user.full_name;
                            this.toBeSaved.ui.btn_label = "Editar";
                            //this.toBeSaved.unique = true;

                            console.log('edit user', this.toBeSaved);
                        } else {

                            this.toBeSaved = {};
                            this.toBeSaved.ui.new = true;
                            this.toBeSaved.ui.title = "Crear Usuario";
                            this.toBeSaved.ui.btn_label = "Grabar";
                            // this.toBeSaved.unique = true;

                            console.log('add user', this.toBeSaved);
                        }

                    },
                    do: function () {

                        this.toBeSaved.clients = '';
                        this.toBeSaved.projects = '';
                        this.toBeSaved.ui = '';

                        if (!this.toBeSaved.phone || this.toBeSaved.phone === "") {
                            this.toBeSaved.phone = "n/a";
                        }

                        if (!this.toBeSaved.address || this.toBeSaved.address === "") {
                            this.toBeSaved.address = "n/a";
                        }
                        return $http.post('api/users/save/', this.toBeSaved);

                    }
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            obj.ui = undefined;
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return apiBase.post('users/delete', {id: this.toBeRemoved.id}, function (data) {
                                return data;
                            });
                            //return  $http.post('api/users/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                },
                toggleEnable: function (id, enabled) {
                    if (id !== undefined && enabled !== undefined) {
                        return $http.post('api/users/enable/', {id: id, enabled: enabled});
                    }
                }
            };

            /******************************************************************
             * Settings
             *****************************************************************/

            this.settings = {
                get: function (raw) {
                    raw = (raw !== undefined && raw) ? "true" : "";

                    return apiBase.get('settings/get_all/' + raw, function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return  $http.post('api/settings/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                }
            };

            /******************************************************************
             * Roles
             *****************************************************************/

            this.roles = {
                get: function () {
                    return apiBase.get('roles/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return  $http.post('api/roles/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                },
            };


            /******************************************************************
             * clients
             *****************************************************************/

            this.clients = {
                get: function () {

                    return apiBase.get('clients/get_all', function (data) {

                        angular.forEach(data, function (client, index) {

                            client.loading = false;
                            client.ui = {};

                            if (client.enabled === '1') {
                                client.ui.active_label = "Activo";
                                client.ui.active_class = "btn-success";
                            } else {
                                client.ui.active_label = "Inactivo";
                                client.ui.active_class = "btn-danger";
                            }

                        });

                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return  $http.post('api/clients/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                },
            };

            /******************************************************************
             * projects
             *****************************************************************/

            this.projects = {
                get: function () {
                    return apiBase.get('projects/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return  $http.post('api/projects/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                }
            };

            /******************************************************************
             * projectParent
             *****************************************************************/

            this.projectParents = {
                get: function () {
                    return apiBase.get('project_parents/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: {
                    toBeRemoved: {},
                    set: function (obj) {
                        if (obj !== undefined && obj.id > 0) {
                            this.toBeRemoved = obj;
                        }
                    },
                    do: function () {
                        if (this.toBeRemoved !== undefined && this.toBeRemoved.id > 0) {
                            return  $http.post('api/project_parents/delete/', {id: this.toBeRemoved.id});
                        }
                    }
                },
            };

            /******************************************************************
             * dayBlocks
             *****************************************************************/

            this.dayBlocks = {
                get: function () {
                    return apiBase.get('day_blocks/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                }
            };

            /******************************************************************
             * dayTasks
             *****************************************************************/

            this.dayTasks = {
                get: function () {
                    return apiBase.get('day_tasks/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                },
                hours: function (max) {
                    var maxHours = (max === undefined) ? 8 : max;
                    var timeBlocks = [];
                    for (var i = 0; i < maxHours; i++) {
                        timeBlocks.push({label: i + '.00', value: i + '.00'});
                        timeBlocks.push({label: i + '.25', value: i + '.25'});
                        timeBlocks.push({label: i + '.50', value: i + '.50'});
                        timeBlocks.push({label: i + '.75', value: i + '.75'});
                    }
                    return timeBlocks;
                }
            };

            /******************************************************************
             * dayTypes
             *****************************************************************/

            this.dayTypes = {
                get: function () {
                    return apiBase.get('day_types/get_all', function (data) {

                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                }
            };

            /******************************************************************
             * Categories
             *****************************************************************/

            this.categories = {
                get: function () {
                    return apiBase.get('categories/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                }
            };

            /******************************************************************
             * subCategories
             *****************************************************************/

            this.subCategories = {
                get: function () {
                    return apiBase.get('sub_categories/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                }
            };

            /******************************************************************
             * Days
             *****************************************************************/

            this.days = {
                get: function () {
                    return apiBase.get('days/get_all', function (data) {
                        return data;
                    });
                },
                getOne: function () {
                },
                save: function () {
                },
                remove: function () {
                }
            };

        });
