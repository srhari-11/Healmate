<?php
if(isset($_POST['email'])){
    $to = "yourgmail@gmail.com"; // your Gmail
    $subject = $_POST['subject'];
    $message = "Name: ".$_POST['name']."\nEmail: ".$_POST['email']."\nMessage: ".$_POST['message'];
    $headers = "From: ".$_POST['email'];

    if(mail($to, $subject, $message, $headers)){
        echo "Message sent successfully!";
    } else {
        echo "Message sending failed.";
    }
}
?>