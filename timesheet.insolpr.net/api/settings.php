<?php

/**
 * Description of settings
 *
 * @author vehler
 */
class settings {

    public function __construct() {
        
    }

    public function get_all($raw = false, $return = false) {

        global $db;

        $where = ['autoload' => '1'];
        if ($raw) {
            $where['enabled'] = '1';
        }

        $settings = $db->get('settings', [], $where);
        $s = array();

        foreach ($settings as $setting) {
            if ($setting->values === 1) {
                $setting->values = true;
            }

            if ($setting->values === 0) {
                $setting->values = false;
            }

            $s[$setting->key] = $setting->values;
        }

        if ($return) {
            if ($raw) {
                return $settings;
            } else {
                return $s;
            }
        }

        if ($raw) {
            echo json_encode($settings);
        } else {
            echo json_encode($s);
        }
    }

}
