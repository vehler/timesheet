<?php

class session {

    private $ses;
    private $ses_name;
    public $ses_time;

    function __construct($new_session = 'app_session', $ses_time = '') {
        if (!session_start()) {

            session_start();
            session_regenerate_id();
        }

        $this->ses_name = $new_session;

        if (empty($_SESSION[$this->ses_name])) {
            $_SESSION[$this->ses_name] = array();
        }

        if ($ses_time != '') {
            $this->ses_time = $ses_time;
        }
    }

    function check_creation($time = 1800) {
        if (!isset($_SESSION[$this->ses_name]['CREATED'])) {
            $_SESSION[$this->ses_name]['CREATED'] = time();
        } else if (time() - $_SESSION[$this->ses_name]['CREATED'] > $time) {
            // session started more than set time
            session_regenerate_id();    // change session ID for the current session and invalidate old session ID
            $_SESSION[$this->ses_name]['CREATED'] = time();  // update creation time
        }
    }

    function activity($time = 86400) {
        if ($time != '') {
            $this->ses_time = $time;
        }

        if (isset($_SESSION[$this->ses_name]['LAST_ACTIVITY']) && (time() - $_SESSION[$this->ses_name]['LAST_ACTIVITY'] > $this->ses_time)) {
            // last request was more than et time
            $this->purge();
        } else {
            $_SESSION[$this->ses_name]['LAST_ACTIVITY'] = time();
        }
    }

    function get($name) {
        if (isset($_SESSION[$this->ses_name])) {
            return $_SESSION[$this->ses_name][$name];
        }
    }

    function exists($name) {
        if (isset($_SESSION[$this->ses_name])) {
            if (isset($_SESSION[$this->ses_name][$name])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function get_all() {
        if (isset($_SESSION[$this->ses_name])) {
            return $_SESSION[$this->ses_name];
        }
    }

    function add($name, $values) {
        if (isset($_SESSION[$this->ses_name])) {
            // array_push($_SESSION[$this->ses_name], $name, $values);
            $_SESSION[$this->ses_name][$name] = $values;
        }
    }

    function update($name, $values) {
        if (isset($_SESSION[$this->ses_name])) {
            if (isset($_SESSION[$this->ses_name][$name])) {
                $_SESSION[$this->ses_name][$name] = '';
                $_SESSION[$this->ses_name][$name] = $values;
            } else {
                $this->add($name, $values);
            }
        }
    }

    function delete($name) {
        if (isset($_SESSION[$this->ses_name])) {
            if (isset($_SESSION[$this->ses_name][$name])) {
                unset($_SESSION[$this->ses_name][$name]);
            }
        }
    }

    function purge() {
        if (isset($_SESSION[$this->ses_name])) {
            unset($_SESSION[$this->ses_name]);
            session_unset();
            session_destroy();
            session_regenerate_id(true);
        }
    }

}
