<?php

class email {

    public $from;
    public $to;
    public $template;
    private $headers;
    private $is_html;

    function __construct($from = '', $template = 'template1', $location = '../template/email/') {

        $this->headers = "From: $from\r\n";
        $this->headers .= "Reply-To: $from\r\n";
        $this->headers .= "MIME-Version: 1.0\r\n";
        $this->headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $t_location = "$location$template.html";
        if (file_exists($t_location)) {

            $this->is_html = true;
            $this->template = file_get_contents($t_location);
        } else {
            $this->is_html = false;
        }

        $this->from = $from;
    }

    function send_simple_email($to, $subject, $body) {

        if ($this->is_html) {
            echo 'has template';
            $this->template = str_replace("{{title}}", $subject, $this->template);
            $this->template = str_replace("{{message}}", $body, $this->template);

            if ($to != '') {
                return mail($to, $subject, $this->template, $this->headers);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}
