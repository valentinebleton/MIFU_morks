var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var cors = require('cors');
var app = express();

app.options('*', cors());

app.use('/', express.static(__dirname + '/build'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ dest: './', storage: storage})

app.post('/uploadSourceFile', upload.any(), function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(req.files); // form files
    res.send('plop');
    res.status(204).end();
});

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
