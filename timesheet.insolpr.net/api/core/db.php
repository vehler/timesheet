<?php

class db extends ezSQL_mysql {

    function db($dbuser = '', $dbpassword = '', $dbname = '', $dbhost = 'localhost', $encoding = '') {
        $this->ezSQL_mysql($dbuser, $dbpassword, $dbname, $dbhost, $encoding);
    }

    function insert($table = '', $valuesArray = array()) {
        $query = "INSERT INTO `$table` ";
        // Add all keys
        $keysIterator = 0;
        $keysCount = count($valuesArray);
        foreach ($valuesArray as $key => $value) {

            ($keysIterator == 0) ? $query .= "(" : "";
            ($keysIterator + 1 == $keysCount) ? $query .= "`$key`)" : $query .= "`$key`, ";
            $keysIterator ++;
        }
        $query .= " VALUES ";

        // Add all values
        $valuesIterator = 0;
        $valuesCounter = count($valuesArray);
        foreach ($valuesArray as $key => $value) {

            $value = parent::escape(trim($value));
            ($valuesIterator == 0) ? $query .= "(" : "";
            ($valuesIterator + 1 == $valuesCounter) ? $query .= "'$value')" : $query .= "'$value', ";
            $valuesIterator ++;
        }
        echo $query;
        return parent::query($query);
    }

    function update($table = '', $valuesArray = array(), $where = '', $and = '') {
        $query = "UPDATE `" . $table . "` SET ";

        // Add all values
        $i = 0;
        $c = count($valuesArray);
        foreach ($valuesArray as $key => $value) {

            $value = parent::escape($value);
            if ($i + 1 == $c) {
                $query .= " `$key`='$value'";
            } else {
                $query .= " `$key`='$value',";
            }
            $i ++;
        }

        $query .= " WHERE ";

        // Add all WHEREs
        $i = 0;
        $c = count($where);
        foreach ($where as $key => $value) {

            $value = parent::escape($value);
            if ($i == 0) {
                $query .= "`$key`='$value' ";
            } else {
                $query .= " AND `$key`='$value' ";
            }
            $i ++;
        }

        if ($and != '' && is_array($and_or)) {

            $query .= " AND ";

            // Add all WHEREs
            $i = 0;
            $c = count($and);
            foreach ($and as $key => $value) {

                $value = parent::escape($value);
                if ($i + 1 == $c) {
                    $query .= "`$key`='$value'";
                } else {
                    $query .= "`$key`='$value', ";
                }
                $i ++;
            }
        }

        echo $query;
        return $this->query($query);
    }

    function delete($table, $where, $and = '', $or = '') {
        
    }

}
