<?php
  $directory = $_GET['profileDir'];
  $profiles = array_diff(scandir($directory), array('..', '.'));
  print_r(json_encode($profiles));
?>
