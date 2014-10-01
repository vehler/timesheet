<?php

include_once 'api/core/api_config.php';


$v = array(
    'fullname' => ' blah',
    'email' => 'blah@gmail.com',
    'password' => '123456',
    'enabled' => '1',
    'contract' => '1'
);
//$id = $db->insert('users', $v);

echo "<br/>";

$v = array(
    //'fullname' => 'blah',
    //'username' => 'jimmy',
    //'email' => 'blah@gmail.com',
    //'password' => '1111111111111111F',
    'enabled' => '1',
    //'contract' => '0'
);

$id = $db->update('users', $v, array('enabled' => 'NULL'));
echo "<br/>";
echo $id;