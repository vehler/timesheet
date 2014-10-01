'use-strict';

timesheet.directive('spinner', function() {
    return function(scope, element, attrs) {
        element.spinner({min: 0, max: 500});
    };
});

timesheet.directive('printDiv', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function(evt) {
                evt.preventDefault();
                PrintElem(attrs.printDiv);
            });

            function PrintElem(elem)
            {
                PrintWithIframe($(elem).html());
            }

            function PrintWithIframe(data)
            {
                if ($('iframe#printf').size() === 0) {
                    $('html').append('<iframe id="printf" name="printf"></iframe>');  // an iFrame is added to the html content, then your div's contents are added to it and the iFrame's content is printed
                    var mywindow = window.frames["printf"];
                    mywindow.document.write('<html><head><title></title><style>@page {margin: 25mm 0mm 25mm 5mm}</style>'  // Your styles here, I needed the margins set up like this
                            + '</head><body><div>'
                            + data
                            + '</div></body></html>');

                    $(mywindow.document).ready(function() {
                        mywindow.print();
                        setTimeout(function() {
                            $('iframe#printf').remove();
                        },
                                2000);  // The iFrame is removed 2 seconds after print() is executed, which is enough for me, but you can play around with the value
                    });
                }

                return true;
            }
        }
    };
});

timesheet.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            //alert(element.$events);
            modelCtrl.$parsers.push(function(inputValue) {
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

timesheet.directive('charCount', function() {
    return {
        restrict: 'A',
        scope: {
            charCount: '=charCount'
        },
        link: function linker(scope, element, attr) {
            setTimeout(function() {
                element.charCount(scope.charCount);
            }, 200);
        }
    };
});
function putObject(path, object, value) {
    var modelPath = path.split(".");

    function fill(object, elements, depth, value) {
        var hasNext = ((depth + 1) < elements.length);
        if (depth < elements.length && hasNext) {
            if (!object.hasOwnProperty(modelPath[depth])) {
                object[modelPath[depth]] = {};
            }
            fill(object[modelPath[depth]], elements, ++depth, value);
        } else {
            object[modelPath[depth]] = value;
        }
    }
    fill(object, modelPath, 0, value);
}
