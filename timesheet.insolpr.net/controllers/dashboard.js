'use-strict';

timesheet.components.controller('dashboard', function ($scope, $filter, $http, growl, api) {


    $scope.month = {};
    $scope.month.number = $filter('date')(Date.today(), 'M');
    $scope.month.days = {};
    // Active day  duh! :P holds information of the current day opened in the calendar
    $scope.month.active_day = {};
    $scope.month.active_day.date = new Date.today();
    // Day blocks
    $scope.month.active_day.has_blocks = false;
    $scope.month.active_day.blocks = {};


    /******************************************************************
     * UI / Animations
     *****************************************************************/

    $scope.ui.dashboard = {};
    $scope.ui.dashboard.show = false;
    $scope.ui.notifications = {};
    $scope.ui.notifications.bar = false;
    /******************************************************************
     * Admin Access
     *****************************************************************/

//    $scope.month.admin.get_users = function () {
//
//        $http.get('api/users/get_all/true').success(function (data) {
//            if (!data.error) {
//                var non_admin_users = [];
//                angular.forEach(data, function (u) {
//                    //console.log(u);
//                    if (u.role && u.role > 2) {
//                        non_admin_users.push(u);
//                    }
//                });
//                //   console.log(non_admin_users);
//                $scope.month.admin.all_users = non_admin_users;
//            } else {
//                $scope.month.admin.all_users = [];
//            }
//        });
//    };
    /******************************************************************
     * Manage Month 
     *****************************************************************/

    $scope.month.get_number = function (n) {
        $scope.month.number = $scope.date_filter(n, 'M');
    };
    $scope.month.set_active_user = function (user_id, user) {

        console.log('id', user_id);
        
//        var _activeUser = api.auth.activeUser($scope.loggedUser, user_id, $scope.app.users);
//        if(_activeUser.isAdmin && _activeUser.hasUser){
//            console.log('');
//        }
        
        if ($scope.loggedUser.role < 3 && user_id !== undefined && user === undefined) {

            console.log('theres and admin user present');
            $scope.app.active_user = $filter('filter')($scope.app.users, {id: user_id})[0];
            $scope.month.active_day.blocks = {};
            $scope.month.get_days();
            $scope.month.active_day.get_blocks();
            $scope.ui.dashboard.show = true;
            $scope.ui.notifications.bar = true;
        } else {
            console.log('regular user');
            $scope.ui.dashboard.show = true;
            $scope.ui.notifications.bar = true;
            $scope.app.active_user = user;
        }

        console.log('active user', $scope.app.active_user);
    };
    /******************************************************************
     * Manage Days
     *****************************************************************/

    $scope.month.get_days = function () {

        var month = $scope.month.number;
        var request = ($scope.app.active_user !== undefined) ? month + '/' + $scope.app.active_user.id : month + '/';
        $http.get('api/days/get/' + request).success(function (data) {
            //   console.log('month days', data);
            $scope.month.days = data;
        }).error(function (error) {

        });
    };
    /******************************************************************
     * Manage Active Day and Blocks
     *****************************************************************/

    $scope.month.active_day.get_blocks = function () {
        $scope.month.active_day.has_blocks = false;
        // console.log('blocks before get', $scope.month.active_day.blocks);
        //$scope.month.active_day.blocks = {};
        //$scope.month.active_day.has_blocks = false;
        var date = $scope.date_filter($scope.month.active_day.date, 'yyyy-M-dd');
        var request = ($scope.app.active_user !== undefined) ? date + '/' + $scope.app.active_user.id : date + '/';
        $http.get('api/day_blocks/get/' + request).success(function (data) {

            console.log('blocks response', data);
            if (data.length > 0) {

                $scope.month.active_day.has_blocks = true;
                $scope.month.active_day.blocks = data;
            } else {
                $scope.month.active_day.has_blocks = false;
                $scope.month.active_day.blocks = [];
            }

        }).error(function (error) {

        });
        console.log('blocks', $scope.month.active_day.blocks);
        console.log('has blocks', $scope.month.active_day.has_blocks);
    };
    $scope.month.active_day.setup_block = function (day_block, form_type) {

        //filtered date
        var fd = $scope.date_filter($scope.month.active_day.date, 'yyy-M-dd');
        $scope.month.active_day.active_day_block = {};
        $scope.month.active_day.active_day_block.type = form_type;
        var last_saved_block = angular.copy($scope.month.active_day.blocks).pop();
        if (last_saved_block !== undefined) {
            $scope.month.active_day.active_day_block.total_worked_hours = last_saved_block.total_worked_hours;
            $scope.month.active_day.active_day_block.last_end_time = Date.parse(last_saved_block.end_time);
        } else {
            $scope.month.active_day.active_day_block.total_worked_hours = '';
            $scope.month.active_day.active_day_block.last_end_time = null;
        }



        if (form_type === 'add') {

            $scope.month.active_day.active_day_block.id = '0';
            $scope.month.active_day.active_day_block.title = "A&ntilde;adir Horario de Trabajo a " + $scope.date_filter($scope.month.active_day.date, 'shortDate');
            $scope.month.active_day.active_day_block.btn = "A&ntilde;adir";
            $scope.month.active_day.active_day_block.id_day_type = '1';
            $scope.month.active_day.active_day_block.is_billable = '1';
            $scope.month.active_day.active_day_block.date = $scope.date_filter($scope.month.active_day.date, 'yyyy-M-dd');
           
           // Day has blocks
            if ($scope.month.active_day.active_day_block.last_end_time !== null) {
                
                if ($scope.month.active_day.active_day_block.total_worked_hours >= 8) {
                    // Day is overtime block
                    $scope.month.active_day.active_day_block.start_time = $scope.month.active_day.active_day_block.last_end_time;
                    $scope.month.active_day.active_day_block.end_time = new Date($scope.month.active_day.active_day_block.start_time).addHours(2);
                
                } else if ($scope.month.active_day.active_day_block.total_worked_hours >= 4) {
                    // Day after lunch block
                    $scope.month.active_day.active_day_block.start_time = $scope.month.active_day.active_day_block.last_end_time.addHours(1);
                    $scope.month.active_day.active_day_block.end_time = new Date($scope.month.active_day.active_day_block.start_time).addHours(4);
                } else {
                    // Day has some blocks
                    $scope.month.active_day.active_day_block.start_time = $scope.month.active_day.active_day_block.last_end_time;
                    $scope.month.active_day.active_day_block.end_time = new Date($scope.month.active_day.active_day_block.start_time).addHours(5);
                }
           
            } else {
                // New day
                $scope.month.active_day.active_day_block.start_time = new Date($scope.month.active_day.date).addHours(8);
                $scope.month.active_day.active_day_block.end_time = new Date($scope.month.active_day.active_day_block.start_time).addHours(4);
            }




        } else if (form_type === 'edit') {

            $scope.month.active_day.active_day_block = angular.copy(day_block);
            $scope.month.active_day.active_day_block.start_time = new Date(day_block.date + ' ' + day_block.start_time);
            $scope.month.active_day.active_day_block.end_time = new Date(day_block.date + ' ' + day_block.end_time);
            $scope.month.active_day.active_day_block.title = "Editar Horario de Trabajo";
            $scope.month.active_day.active_day_block.btn = "Editar";
        }
        console.log('active block setup', $scope.month.active_day.active_day_block);
    };
    $scope.month.active_day.block_time_check = function (type, block) {

        if (block !== undefined) {
            if (type === 'before' || type === 'all') {

                if (block.start_time < block.last_end_time) {
                    return true;
                }

            } else if ('between' || type === 'all') {
                if (block.end_time < block.start_time) {
                    return true;
                }
            }
        }
        return false;
    };
    $scope.month.active_day.save_block = function (day_block, isValid) {


        if (day_block.id_day_type > 1) {
            console.log('daytype is higher');
            day_block.id_client = 9999;
        }

        day_block.start_time = $scope.date_filter(day_block.start_time, 'HH:mm:ss');
        day_block.end_time = $scope.date_filter(day_block.end_time, 'HH:mm:ss');
        console.log('save day block', day_block);
        var request = ($scope.app.active_user !== undefined) ? $scope.app.active_user.id : $scope.loggedUser.id;
        //return;

        $http.post('api/day_blocks/save/' + request, day_block).success(function (data) {

            console.log('response from save day block', data);
            if (data.result > 0) {
                //$scope.month.active_day.blocks.push(data);
                $scope.month.active_day.get_blocks();
                var msg = (day_block.type === 'add') ? "El horario de trabajo se añadió exitosamente" : "El horario de trabajo se editó exitosamente";
                growl.addSuccessMessage(msg);
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function (error) {
            console.log(error);
        });
        $('#dayBlockForm').modal('hide');
    };
    $scope.month.active_day.block_delete_set = function (day_block) {
        console.log('block to delete', day_block);
        $scope.month.active_day.day_block_to_delete = day_block;
    };
    $scope.month.active_day.delete_block = function () {

        $http.post('api/day_blocks/delete/', $scope.month.active_day.day_block_to_delete).success(function (data) {

            console.log('response from delete block', data);
            if (data.result > 0) {
                $scope.month.active_day.get_blocks();
                var msg = "El horario de trabajo se eliminado exitosamente";
                growl.addSuccessMessage(msg);
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function (error) {
            console.log(error);
            growl.addWarnMessage($scope.msg.generalError);
        });
        $('#deleteWorkBlock').modal('hide');
    };
    /******************************************************************
     * Manage Active Tasks
     *****************************************************************/


    $scope.month.active_day.setup_task = function (task, form_type, block) {

        $scope.month.active_day.active_task = {};
        $scope.month.active_day.active_task.type = form_type;
        $scope.month.active_day.active_task.id_user = $scope.app.active_user.id;
        $scope.month.active_day.active_task.block = block;
        if (form_type === 'add') {

            $scope.month.active_day.active_task.id = '0';
            $scope.month.active_day.active_task.title = "A&ntilde;adir Tarea";
            $scope.month.active_day.active_task.btn = "A&ntilde;adir";
            $scope.month.active_day.active_task.id_day_block = block.id;
        } else if (form_type === 'edit') {

            $scope.month.active_day.active_task = angular.copy(task);
            $scope.month.active_day.active_task.title = "Editar Tarea";
            $scope.month.active_day.active_task.btn = "Editar";
        }
        console.log('active task', $scope.month.active_day.active_task);
    };
    $scope.month.active_day.save_task = function (task, isValid) {


        $http.post('api/day_tasks/save/', task).success(function (data) {

            console.log('response from save day task', data);
            if (data.result > 0) {
                //$scope.month.active_day.blocks.push(data);
                $scope.month.active_day.get_blocks();
                var msg = (task.type === 'add') ? "La tarea se añadió exitosamente" : "La tarea se editó exitosamente";
                growl.addSuccessMessage(msg);
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function (error) {
            console.log(error);
        });
        $('#taskForm').modal('hide');
    };
    $scope.month.active_day.task_delete_set = function (task) {
        $scope.month.active_day.task_to_delete = task;
    };
    $scope.month.active_day.delete_task = function () {
        $http.post('api/day_tasks/delete/', $scope.month.active_day.task_to_delete).success(function (data) {

            console.log('response from delete block', data);
            if (data.result > 0) {
                $scope.month.active_day.get_blocks();
                var msg = "La tarea se eliminado exitosamente";
                growl.addSuccessMessage(msg);
            } else {
                growl.addWarnMessage($scope.msg.generalError);
            }
        }).error(function (error) {
            console.log(error);
            growl.addWarnMessage($scope.msg.generalError);
        });
        $('#deleteTask').modal('hide');
    };
    /******************************************************************
     * Miscelaneous
     *****************************************************************/

    $scope.asHour = function (dt) {
        // console.log('as ahour',  Date.parse(dt));
        // console.log('active day', $scope.month.active_day.date);
        //var d = $scope.date_filter($scope.month.active_day.date, 'shortDate');
        return $scope.date_filter(Date.parse(dt), 'h:mm a');
    };
    $scope.timePickerOptions = {
        step: $scope.app.time_interval,
        timeFormat: 'g:i a',
        useSelect: true,
        className: 'form-control'
    };
    $scope.hours_select = function (max_time) {

        var t = [];
        for (var i = 0; i < max_time; i++) {
            t.push({label: i + '.00', value: i + '.00'});
            t.push({label: i + '.25', value: i + '.25'});
            t.push({label: i + '.50', value: i + '.50'});
            t.push({label: i + '.75', value: i + '.75'});
        }
        console.log('hours select', t);
        $scope.task_hours_select = t;
    };
    /******************************************************************
     * Calendar / Dashboard initialization
     *****************************************************************/

    $scope.dashboard_init = function () {

        
        $scope.task_hours_select = api.dayTasks.hours(8);
        //wait until the user is returned
        $scope.$watch(function (scope) {
            return scope.loggedUser;
        }, function (user) {

            console.log('watch new', user);
            if ($scope.loggedUser.role < 3) {

                //$scope.month.admin.get_users();
            } else {

                $scope.ui.dashboard.show = true;
                $scope.month.set_active_user('', user);
                $scope.month.get_days();
                $scope.month.active_day.get_blocks();
            }

        });
    };
    $scope.dashboard_init();
});