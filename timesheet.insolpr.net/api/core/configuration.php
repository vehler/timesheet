<?php

/*
 * Application Constants
 * 
 */

define('DB_NAME', 'timesheet_admin', true);
define('DB_USER', 'insol_timesheet', true);
define('DB_PASS', 'azigisefaw05!@#', true);
define('DB_SERVER', 'mysql.insolpr.com', true);
define('DB_ENCODING', 'utf-8', true);


define('TIMEZONE', 'America/Puerto_Rico', true);

define('SESSION_NAME', 'timesheet', true);
define('SESSION_REGENERATE', 3600, true);
define('SESSION_TIMEOUT', 86400, true);

define('debug', true, true);

//Brute force login protection
define('LOGIN_MAX_ATTEMPTS', 5, true);
define('LOGIN_LOCK_TIME', 2, true);
define('LOGIN_AUTH_SALT', 'hl0&>c<~Vboc~G|FCg)]r2 ,jlBqHt%,[Py8nYKPE&K4&TN_)z*p|61(|6MnIcS4');
