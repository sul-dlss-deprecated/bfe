<?php
  header('Access-Control-Allow-Origin: "*"');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: x-requested-with');
  header('Access-Control-Max-Age: 604800');

  #print_r($_POST);
  
  $exportUrl = $_POST['exportUrl'];
  $rdfData = $_POST['rdfData'];
  $id = $_POST['id'];
  $output = '';

  file_put_contents('temp' . $id . '.json', $rdfData, LOCK_EX);

  $cmd = "nohup curl -X POST -H 'Content-Type:application/ld+json' --data-binary '@temp". $id .".json' " . $exportUrl;

  exec($cmd, $output, $return);

  echo $output[0];
?>
