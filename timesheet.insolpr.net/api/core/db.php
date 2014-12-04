<?php

class db extends ezSQL_mysql {

    public $show_query = false;
    public $called_query;

    function __construct($dbuser = '', $dbpassword = '', $dbname = '', $dbhost = 'localhost', $encoding = '') {
        parent::__construct($dbuser, $dbpassword, $dbname, $dbhost, $encoding);
    }

    /**
     * 
     * @param type $table
     * @param type $data
     * @param type $where
     * @param type $or
     * @param type $order_by
     * @param type $limit
     * @return type
     */
    function get($table = '', $data = null, $where = null, $or = null, $order_by = null, $limit = null) {
        $sql = $this->data($table, $data, 'select') . $this->conditions($where, $or, $order_by, $limit);
        if ($this->show_query) {
            $this->called_query = $sql . "\n";
        }
        return $this->get_results($sql);
    }

    function get_one($table = '', $data = null, $where = null, $or = null, $order_by = null, $limit = null) {
        $sql = $this->data($table, $data, 'select') . $this->conditions($where, $or, $order_by, $limit);
        if ($this->show_query) {
            $this->called_query = $sql . "\n";
        }
        return $this->get_row($sql);
    }

    function insert($table = '', $data = null, $where = null, $or = null, $limit = null) {
        $sql = $this->data($table, $data, 'insert') . $this->conditions($where, $or, [], $limit);
        if ($this->show_query) {
            $this->called_query = $sql . "\n";
        }
        return $this->query($sql);
    }

    function update($table = '', $data = null, $where = null, $or = null, $limit = null) {
        $sql = $this->data($table, $data, 'update') . $this->conditions($where, $or, [], $limit);
        if ($this->show_query) {
            $this->called_query = $sql . "\n";
        }
        return $this->query($sql);
    }

    function delete($table, $where = null, $or = null, $limit = null) {
        $sql = $this->data($table, [], 'delete') . $this->conditions($where, $or, [], $limit);
        if ($this->show_query) {
            $this->called_query = $sql . "\n";
        }
        return $this->query($sql);
    }

    private function data($tables, $table_columns = null, $query_type = 'SELECT') {
        $table_names_string = "";
        if (is_array($tables)) {
            $i = 1;
            $c = count($tables);
            foreach ($tables as $table) {

                if (is_array($table)) {
                    foreach ($table as $tabled_name => $table_alias) {
                        if ($i < $c) {
                            $table_names_string .= "`" . $this->dbname . "`.`" . $tabled_name . "` as $table_alias, ";
                        } else {
                            $table_names_string .= "`" . $this->dbname . "`.`" . $tabled_name . "` as $table_alias ";
                        }
                    }
                } else {
                    if ($i < $c) {
                        $table_names_string .= "`" . $this->dbname . "`.`$table`, ";
                    } else {
                        $table_names_string .= "`" . $this->dbname . "`.`$table` ";
                    }
                }

                $i++;
            }
        } else {
            $table_names_string .= "`" . $this->dbname . "`.`$tables`";
        }

        $sql_string = "";
        if (is_array($table_columns)) {
            $fields = array_keys($table_columns);
            $values = $table_columns;
        }

        $query_type = strtoupper($query_type);

        switch ($query_type) {
            default :
            case 'SELECT':
                if (is_array($table_columns) && !empty($table_columns)) {

                    $select_string = "";
                    $i = 1;
                    $c = count($table_columns);
                    foreach ($table_columns as $field) {
                        if ($i < $c) {
                            $select_string .= "$field, ";
                        } else {
                            $select_string .= "$field ";
                        }
                        $i ++;
                    }

                    $sql_string .= "$query_type $select_string FROM $table_names_string ";
                } else {
                    $d = ($table_columns == '*' || $table_columns == '' || empty($table_columns)) ? "*" : "`$table_columns`";
                    $sql_string .= "$query_type $d FROM $table_names_string ";
                }
                break;

            case 'UPDATE':
                if (is_array($table_columns)) {
                    $update_string = "";
                    $i = 1;
                    $c = count($table_columns);
                    foreach ($table_columns as $field => $value) {
                        if ($i < $c) {
                            $update_string .= "`$field` = '" . $value . "', ";
                        } else {
                           // $_v = ($value == null) ? null : "'" . $value . "'";
                            $update_string .= "`$field` = '$value' ";
                        }

                        $i ++;
                    }
                    $sql_string .= "$query_type $table_names_string SET $update_string ";
                } else {
                    $sql_string .= "$query_type $table_names_string SET $table_columns ";
                }

                break;

            case 'REPLACE':
            case 'INSERT':
                if (is_array($table_columns)) {
                    $sql_string .= "$query_type INTO $table_names_string (" . implode(', ', $fields) . ") VALUES ('" . implode("', '", $values) . "') ";
                } else {
                    $sql_string .= "$query_type INTO $table_names_string $table_columns ";
                }
                break;

            case 'DELETE':
                $sql_string .= "$query_type FROM $table_names_string ";
                break;
        }
        return $sql_string;
    }

    private function conditions($where = null, $or = null, $order_by = null, $limit = null) {
        $sql = "";

        //Check if the where is an array and is not empty so we can build the sql string
        if ($where && is_array($where) && !empty($where)) {
            $sql .= "WHERE ";
            $i = 1;
            $c = count($where);
            foreach ($where as $column => $value) {
                $v;

                /**
                 * check to see if the value is an array to impode and use
                 * examples:    ['column', '>', 'value'] 
                 */
                if (is_array($value)) {
                    $v = implode(' ', $value);
                    if ($i < $c) {
                        $sql .= "$v AND ";
                    } else {
                        $sql .= "$v ";
                    }
                } else {

                    /**
                     * if its not an array just join by the original field and value
                     */
                    $v = parent::escape($value);
                    if ($i < $c) {
                        $sql .= "$column = '$v' AND ";
                    } else {
                        $sql .= "$column = '$v' ";
                    }
                }
                $i ++;
            }
        } else if (is_string($where)) {
            $sql .= " $where ";
        }

        if ($or && is_array($or) && !empty($or)) {
            $sql .= "OR ";
            $i = 1;
            $c = count($or);

            foreach ($or as $column => $value) {

                /**
                 * check to see if the value is an array to impode and use
                 * examples:    ['column', '>', 'value'] 
                 */
                if (is_array($value)) {
                    $v = implode(' ', $value);
                    if ($i < $c) {
                        $sql .= "$v OR ";
                    } else {
                        $sql .= "$v ";
                    }
                } else {

                    $value = parent::escape($value);

                    if ($i < $c) {
                        $sql .= "`$column` = '$value' OR ";
                    } else {
                        $sql .= "`$column` = '$value' ";
                    }
                }
                $i ++;
            }
        } else if (is_string($or)) {
            $sql .= " $or";
        }

        if ($order_by && is_array($order_by) && !empty($order_by)) {
            $sql .= "ORDER BY ";
            $i = 1;
            $c = count($order_by);

            foreach ($order_by as $column => $value) {
                $column = ($column != '') ? $column : '';

                if ($i < $c) {
                    if (is_array($column)) {
                        $sql .= implode(' ', $column);
                    } else {
                        $sql .= "$column $value, ";
                    }
                } else {

                    $sql .= " $column $value ";
                }
                $i ++;
            }
        } else if (is_string($order_by)) {
            $sql .= "ORDER BY $order_by ";
        }

        if ($limit && is_array($limit) && !empty($limit)) {
            $sql .="LIMIT " . implode(', ', $limit);
        } else if (is_string($limit)) {
            $sql .= "LIMIT $limit ";
        }
        return $sql;
    }

    function clean($str) {
        return mysql_real_escape_string(stripslashes($str));
    }

    function is_assoc($var) {
        return is_array($var) && array_diff_key($var, array_keys(array_keys($var)));
    }

}
