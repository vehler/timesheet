'use-strict';

timesheet.directive('hourpicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            hourpicker: '=hourpicker'
        },
        link: function ($scope, $element, $attrs, ngModel) {

            $element.timepicker({
                useSelect: true,
                className: 'form-control',
            });

            $element.on('change', function () {
                console.log('changeTime', $element.timepicker());
            });
        }
    };
});

timesheet.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            //alert(element.$events);
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your
                // input.
                // In such cases, when a letter is typed first, this parser will
                // be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue === undefined)
                    return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});

timesheet.directive('charCount', function () {
    return {
        restrict: 'A',
        scope: {
            charCount: '=charCount'
        },
        link: function linker(scope, element, attr) {
            setTimeout(function () {
                element.charCount(scope.charCount);
            }, 200);
        }
    };
});


timesheet.directive('timePicker', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                options: '=timePicker'
            },
            priority: 1,
            link: function (scope, element, attrs, ngModel) {
                'use strict';

                if (!ngModel) {
                    console.log('No model present');
                    return;
                }

//                console.log(scope.options);
//                        console.log('scope', scope);
//                        console.log('element', element);
//                        console.log('attrs', attrs);
//                        console.log('ngModel', ngModel.$render());

                ngModel.$render = function () {
                    var date = ngModel.$modelValue;
                    //console.log(date);
                    if (angular.isDefined(date) && date !== null && !angular.isDate(date)) {
                        // throw new Error('ng-Model value must be a Date object - currently it is a ' + typeof date + '.');
                        date = new Date();
                    }
                    if (!element.is(':focus')) {
                        element.timepicker('setTime', date);
                    }
                };

                scope.$watch(attrs.ngModel, function () {
                    ngModel.$render();
                }, true);

                element.timepicker(scope.options);

                if (element.is('input')) {
                    ngModel.$parsers.unshift(function () {
                        var date = element.timepicker('getTime', ngModel.$modelValue);
                        return date;
                    });
                } else {
                    element.on('changeTime', function () {
                        scope.$evalAsync(function () {
                            var date = element.timepicker('getTime', ngModel.$modelValue);
                            ngModel.$setViewValue(date);
                        });
                    });
                }
            }
        };
    }]);


timesheet.directive('modal', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        scope: {
            name: '=name',
            modal: '=modal'
        },
        link: function ($scope, $element, $attrs, ngModel) {

        }
    };
});

timesheet.directive('uiBlur', function() {
    return function( scope, elem, attrs ) {
      elem.bind('blur', function() {
        scope.$apply(attrs.uiBlur);
      });
    };
});