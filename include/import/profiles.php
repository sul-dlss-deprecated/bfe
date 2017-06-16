<?php
  header('Access-Control-Allow-Credentials: true');

  $profilesUrl = "http://ld4p-loc-profiles-dev.stanford.edu/profiles/";

  $profilePath = $_SERVER['DOCUMENT_ROOT'] . "/../" . $_GET['profileDir'];

  foreach (getallheaders() as $name => $value) {
		if($name == 'Cookie') {
    	$webAuth = $value;
		}
	}

	$cmd = "wget -r -nH --cut-dirs 1 -A json --header 'Cookie:". $webAuth ."' ". $profilesUrl ." -P ". $profilePath;

  exec($cmd, $output, $return);

  foreach($output as $msg) {
  	echo $msg . "\n";
	}
?>
