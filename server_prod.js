var express = require('express');
var multer  = require('multer');
// var fs = require('fs');
var cors = require('cors');
var app = express();
var path = require('path');
var MIFU = require('./calculations/ScriptReportNew.js');
// var MIFU = require('./build_backend/genMIFU.js');

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
  console.log(req.files[0].originalname);
  fs.renameSync('./'+req.files[0].originalname, './workdir/input/'+req.files[0].originalname)
  res.send('plop');
  res.status(204).end();
});

app.get('/genMIFU', function (req, res) {
  var vdbPath = __dirname + '/workdir/input/Extrait_VDB.xlsx';
  var spiPath = __dirname + '/workdir/input/Extrait_SPI.xlsx';
  var pdmsPath = __dirname + '/workdir/input/Extrait_PDMS.xls';
  var previousMIFUPath = __dirname + '/workdir/input/previous_MIFU.xlsx';

  var targetPath = __dirname + '/workdir/output/newMIFU.xlsx';

  var statusMIFU = MIFU.generateMIFU(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath);

  res.download(targetPath); // Set disposition and send it.

});


var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
