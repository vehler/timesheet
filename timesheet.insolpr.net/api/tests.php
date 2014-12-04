<?php



include 'core/email.php';

$e = new email('lvelez@insolpr.com');
echo $e->send_simple_email('lvelez@gmail.com', 'test', 'test de clase');

