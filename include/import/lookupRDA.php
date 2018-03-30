<?php
  header('Content-Type: text/plain');

	$url = $_GET['scheme'];

  $cmd = "curl -G " . $url . " -H Content-Type: text/plain";
		
  exec($cmd, $output, $return);

	echo implode($output);
	
?>
