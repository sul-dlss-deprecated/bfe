<?php
  $profilesUrl = "http://ld4p-loc-profiles-dev.stanford.edu/profiles/";

  $cmd = "wget -r -nH --cut-dirs 1 -A json ". $profilesUrl ." -P ". $_GET['profileDir'];

  exec($cmd, $output, $return);

  foreach($output as $msg) {
  	echo $msg . "\n";
	}
?>
