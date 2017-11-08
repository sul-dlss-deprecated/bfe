<?php
  header('Content-Type: application/json');

	$filename = "vocabularies.json";

  $cmd = "curl -G http://api.metadataregistry.org/vocabularies -o '" . $filename . "'";
	
	if (file_exists($filename)) {
		if((time()-(60*60*24)) < strtotime($filemtime($filename))) {
  		exec($cmd);
		}
	}
	else {
  		exec($cmd);
	}

  #echo json_encode($output[0]);
?>
