<?php
  header('Content-Type: application/json');

	$query = http_build_query([
    'q' => $_GET['q'],
    'count' => '100',
  ]);

	$scheme = $_GET['scheme']; #"http://id.loc.gov/vocabulary/languages";

	$url = $scheme . "/suggest/?" . $query;

  $cmd = "curl -G " . $url;

  exec($cmd, $output, $return);

  echo json_encode($output[0]);
?>
