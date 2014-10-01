'use-strict';

timesheet.filter('phone', function() {
    return function(tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '').replace("-", "");

        if (value.match(/[^0-9]/)) {

        }

        var country, city, number;

        switch (value.length) {
            case 6:
            case 7:
            case 8:
                country = 1;
                city = '787';
                number = value;
                break;
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country === 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

timesheet.filter('capitalize', function() {
    return function(input, param) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});

timesheet.filter('daysAgo', function() {
    return function(time, param) {

        return time;
    };
});

timesheet.filter('truncate', function() {
    return function(text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        } else {
            return String(text).substring(0, length - end.length) + end;
        }

    };
});

timesheet.filter('stripHtml', function() {
    return function(text) {

        var txtHtml = $.parseHTML(text);

        if (typeof (txtHtml[1]) != "undefined") {
            txtHtml = txtHtml[0].data + txtHtml[1].outerText;
            return txtHtml;
        } else {
            return text;
        }
    };
});
timesheet.filter('nospace', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});

timesheet.filter('toStringValue', function() {
    return function(data) {
        if (typeof (data) === 'undefined') {
            return 0;
        }

        switch (data) {
            case 10:
                return "Décimo Grado";
                break;
            case 11:
                return "Undécimo Grado";
                break;
            case 12:
                return "Duodécimo Grado";
                break;
        }
        return sum;
    };
});

timesheet.filter('sumCollection', function() {
    return function(data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var index = data.length - 1; index >= 0; index--) {
            sum += parseInt(data[index][key]);
        }

        return sum;
    };
});

timesheet.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

timesheet.filter('sumTotal', function() {
    return function(data) {
        if (typeof (data) === 'undefined') {
            return 0;
        }

        var keys = new Array('TOTAL_ORG_DECA', 'TOTAL_ORG_FBLA',
                'TOTAL_ORG_SKILL', 'TOTAL_ORG_FCCLA', 'TOTAL_ORG_FFA',
                'TOTAL_ORG_HOSA');

        var sum = 0;

        for (var i = 0; i < keys.length; ++i) {

            for (var index = data.length - 1; index >= 0; index--) {
                sum += parseInt(data[index][keys[i]]);
            }
            ;
        }
        ;

        return sum;
    };
});
timesheet.filter('sumTotalMF', function() {
    return function(data) {
        if (typeof (data) === 'undefined') {
            return 0;
        }

        var keys = new Array('TOTAL_ORG_MALES', 'TOTAL_ORG_FEMALES');

        var sum = 0;

        for (var i = 0; i < keys.length; ++i) {

            for (var index = data.length - 1; index >= 0; index--) {
                sum += parseInt(data[index][keys[i]]);
            }
            ;
        }
        ;

        return sum;
    };
});

timesheet.filter('capitalize', function() {
    return function(input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});

timesheet.filter('vocacionalType', function() {
    return function(input, scope) {
        if (input != null)
            switch (input) {
                case 'NP':
                    break;
                case 'TAS':
                default:
                    break;
            }
        return input;
    };
});

timesheet.filter('clean', function() {
    return function(input, scope) {
        if (input !== null)
            var cleanInput = "";
        cleanInput = timesheet.helper.stripWordHtml(input);
        return input;
    };
});

timesheet.filter('budgetCurrency', function($filter) {
    return function(amount, currencySymbol) {
        var currency = $filter('currency');

        if (amount < 0) {
            return currency(amount, currencySymbol).replace("(", "-").replace(
                    ")", "");
        }

        return currency(amount, currencySymbol);
    };
});