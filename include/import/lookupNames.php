<?php
  header('Content-Type: application/json');

  $query = http_build_query([
    'q' => $_GET['q'],
    'rdftype' => $_GET['rdftype'],
    'count' => '50',
  ]);


  $url = "http://id.loc.gov/authorities/names/suggest/?" . $query;

  $cmd = "curl -G " . $url;

  exec($cmd, $output, $return);

  echo json_encode($output[0]);
?>
