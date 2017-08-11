<?php
  #header('Content-Type: application/json');

  $query = http_build_query([
    'format' => 'json',
    'start' => '1',
    'count' => '50',
    'q' => $_GET['q']
  ]);

  $url = "http://id.loc.gov/search/?" . $query;

  $cmd = "curl -G \"" . $url . "\"";
  exec($cmd, $output, $return);

  echo json_encode($output);
?>
