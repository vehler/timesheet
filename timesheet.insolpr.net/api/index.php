<?php

/**
 * Require core classes
 */
require_once 'core/configuration.php';
require_once 'core/ez_sql_core.php';
require_once 'core/ez_sql_mysql.php';
require_once 'core/session.php';
require_once 'core/router.php';
require_once 'core/db.php';
require_once 'system.php';
require_once 'auth.php';

/**
 * Set Timezone
 */
date_default_timezone_set(TIMEZONE);


/**
 * Start Session if it hasn't been started.
 */
$session = new session(SESSION_NAME);

/**
 *  Regenerate the session ID periodically to avoid attacks on session fixation
 */
$session->check_creation(SESSION_REGENERATE);

/**
 *  Destroy session if more than 24 hours have passed since last activity
 */
$session->activity(SESSION_TIMEOUT);

/**
 * Start Database
 */
$db = new db(DB_NAME, DB_PASS, DB_USER, DB_SERVER, DB_ENCODING);

/**
 * Start the router / application / api
 */
new \router([
    'auth',
    'categories',
    'clients',
    'day_type',
    'positions',
    'projects',
    'roles',
    'settings',
    'sub_categories',
    'system',
    'tasks',
    'users',
    'workdays'
        ]);
