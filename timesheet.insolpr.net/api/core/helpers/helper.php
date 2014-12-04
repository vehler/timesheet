<?php

class helper {

    static function getvar($name, $var, $default = null) {
        $v = '';

        if (isset($_REQUEST[$name]) && $_REQUEST[$name] != '') {
            $v = self::clean($_REQUEST[$name]);
        } else if (isset($var) && $var != '') {
            $v = self::clean($var);
        } else if ($default != null) {
            $v = self::clean($default);
        }
        return $v;
    }

    static function bool($str) {
        return filter_var($str, FILTER_VALIDATE_BOOLEAN);
    }

    static function clean($str) {
//        if (is_array($str)) {
//            return array_map(__METHOD__, $str);
//        }
//        if (!empty($str) && is_string($str)) {
//            return stripcslashes(str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $str));
//        }
//        return mysql_real_escape_string(stripslashes($str));
    }

    static function to_date($date, $format = null) {
        if ($format != null) {
            return "STR_TO_DATE('$date', '$format')";
        } else {
            return "STR_TO_DATE('$date', '%Y-%m-%d')";
        }
    }

    static function to_time($time, $format = null) {
        if ($format != null) {
            return "TIME_FORMAT($time,format)";
        } else {
            return "TIME_FORMAT($time, '%H:%i:%s')";
        }
    }

    static function implode_assoc($array, $wrap = true, $wrap_char = "'", $sep = ",", $comp_char = '=', $escape = true) {
        $str = "";
        $iterator = 1;
        $array_count = count($array);

        foreach ($array as $key => $value) {

            $str .= $key . " " . $comp_char . " ";

            $separator = ($iterator < $array_count) ? $sep . " " : " ";

            $value = ($escape) ? self::clean($value) : $value;

            if ($wrap) {
                $str .= $wrap_char . $value . $wrap_char . $separator;
            } else {
                $str .= $value . $separator;
            }

            $iterator++;
        }
        return $str;
    }

    static function implode_numeric($array, $wrap = true, $wrap_char = "'", $escape = true, $wrap_escape_where = '3') {
        $str = "";
        $iterator = 1;
        foreach ($array as $value) {

            if ($iterator % $wrap_escape_where == 0) {
                $value = ($escape) ? self::clean($value) : $value;
                if ($wrap) {
                    $str .= $wrap_char . $value . $wrap_char . " ";
                } else {
                    $str .= $value . " ";
                }
            } else {
                $str .= $value . " ";
            }

            $iterator++;
        }
        return $str;
    }

}
