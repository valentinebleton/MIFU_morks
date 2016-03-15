var express = require('express');
var multer  = require('multer');
var fs = require('fs-extra');
var cors = require('cors');
var expressApp = express();
var path = require('path');
var MIFU = require('./calculations/ScriptReportNew.js');
var ISOS = require('./calculations/ScriptReportIsos.js');
var isoListHelper = require('./calculations/helpers/isoListHelper.js');

expressApp.options('*', cors());

expressApp.use('/', express.static(__dirname + '/build'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ dest: './', storage: storage})

expressApp.get('/wipeAll', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.emptyDirSync(__dirname+'/workdir/input');
  fs.emptyDirSync(__dirname+'/workdir/output');
  res.send('plop');
  res.status(200).end();
});

expressApp.post('/uploadSourceFile', upload.any(), function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.renameSync('./'+req.files[0].originalname, __dirname+'/workdir/input/'+req.files[0].originalname)
  res.send('plop');
  res.status(204).end();
});

expressApp.get('/genMIFU', function (req, res) {
  var vdbPath = __dirname + '/workdir/input/Extrait_VDB.xlsx';
  var spiPath = __dirname + '/workdir/input/Extrait_SPI.xlsx';
  var pdmsPath = __dirname + '/workdir/input/Extrait_PDMS.xls';
  var previousMIFUPath = __dirname + '/workdir/input/previous_MIFU.xlsx';

  var MIFUtargetPath = __dirname + '/workdir/output/newMIFU.xlsx';
  var MIFULogsFile = __dirname + '/workdir/logs/reportErrorsNew.log';

  var statusMIFU = MIFU.generateMIFU(vdbPath, spiPath, pdmsPath, previousMIFUPath, MIFUtargetPath, MIFULogsFile);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send({
    targetPath: '/workdir/output/newMIFU.xlsx',
    logsPath: '/workdir/logs/reportErrorsNew.log',
  });

  res.status(200).end();

});

expressApp.get('/getFile', function (req, res) {

  res.download(__dirname + req.query.pathName);

});


expressApp.get('/genISOS', function (req, res) {
  var vdbPath = __dirname + '/workdir/input/Extrait_VDB.xlsx';
  var spiPath = __dirname + '/workdir/input/Extrait_SPI.xlsx';
  var pdmsPath = __dirname + '/workdir/input/Extrait_PDMS.xls';
  var previousMIFUPath = __dirname + '/workdir/input/previous_MIFU.xlsx';
  var bomPath = __dirname + '/workdir/input/BOM.xlsx';
  var impactedIsosPath = __dirname + '/workdir/input/Impacted_iso.xlsx';

  var targetPath = __dirname + '/workdir/output/newISOstatus.xlsx';
  var statusISOS = ISOS.generateISOS(vdbPath, spiPath, pdmsPath, bomPath, impactedIsosPath, previousMIFUPath, targetPath);

  res.download(targetPath); // Set disposition and send it.
});

expressApp.get('/genISO', function (req, res) {
  var vdbPath = __dirname + '/workdir/input/Extrait_VDB.xlsx';
  var spiPath = __dirname + '/workdir/input/Extrait_SPI.xlsx';
  var pdmsPath = __dirname + '/workdir/input/Extrait_PDMS.xls';
  var previousMIFUPath = __dirname + '/workdir/input/previous_MIFU.xlsx';
  var bomPath = __dirname + '/workdir/input/BOM.xlsx';
  var impactedIsosPath = __dirname + '/workdir/input/Impacted_iso.xlsx';

  var targetPath = __dirname + '/workdir/output/newISOstatus.xlsx';
  var statusISOS = ISOS.generateISOS(vdbPath, spiPath, pdmsPath, bomPath, impactedIsosPath, previousMIFUPath, targetPath);

  res.download(targetPath); // Set disposition and send it.
});

expressApp.get('/getIsoNameList', function (req, res) {
  var bomPath = __dirname + '/workdir/input/BOM.xlsx';
  var listIsoNames = isoListHelper.getIsoNameList(bomPath);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(listIsoNames); // Set disposition and send it.
});

var server = expressApp.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example expressApp listening at http://%s:%s', host, port);
});
