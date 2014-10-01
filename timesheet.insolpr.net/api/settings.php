<?php

/**
 * Description of settings
 *
 * @author vehler
 */
class settings {

    public function __construct() {
        
    }

    public function get_all($params = array()) {

        global $db;
        $raw = isset($params['raw']) ? $params['raw'] : false;
        $settings = $db->get_results("SELECT s.key, s.values FROM settings as s WHERE s.autoload = 1 AND s.enabled = 1");
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
//        if(debug){
//            $s['debug'] = $db->get_debug();
//        }

        if ($raw) {
            echo json_encode($settings);
        } else {
            echo json_encode($s);
        }
    }

}
