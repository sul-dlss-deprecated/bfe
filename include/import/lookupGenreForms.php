<?php
  header('Content-Type: application/json');

  $query = http_build_query([
    'q' => $_GET['q'],
    'rdftype' => $_GET['rdftype']
  ]);


  $url = "http://id.loc.gov/authorities/genreForms/suggest/?" . $query;

  $cmd = "curl -G " . $url;

  exec($cmd, $output, $return);

  echo json_encode($output[0]);
?>
