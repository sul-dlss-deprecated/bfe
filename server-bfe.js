//   Minimal BIBFRAME Editor Node.js server. To run from the command-line:
//   node server-bfe.js

var port = 8000;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

// require php-express and config
var phpExpress = require('php-express')({
  binPath: '/usr/bin/php'
});

app.set('views', './stanford/export');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
//
app.use(express.static(__dirname + '/'));
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port);

// routing all .php file to php-express
app.all(/.+\.php$/, phpExpress.router);
//
// var exec = require("child_process").exec;
// app.get('/stanford/export/', function(req, res){
//   exec("php export.php", function (error, stdout, stderr) {
//     res.send(stdout);
//   });
// });

console.log('BIBFRAME Editor running on ' + port);
console.log('Press Ctrl + C to stop.');
