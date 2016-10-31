<?php
    if(!empty($_POST['text'])){
        if(!empty($_POST['user'])){
            if(!empty($_POST['type'])){
                $data = $_POST['text'];
                $fname = "";
                if ($_POST['type'] === "code") {
                    $fname = $_POST['user'] . "_" . $_POST['type'] . "-" . mktime() . ".js";
                } elseif ($_POST['type'] === "console") {
                    $fname = $_POST['user'] . "_" . $_POST['type'] . "-" . mktime() . ".txt";
                }
                $file = fopen("saved/" .$fname, 'a') or die();  //creates new file
                fwrite($file, $data);
                fclose($file);
            }
        }
    }
?>