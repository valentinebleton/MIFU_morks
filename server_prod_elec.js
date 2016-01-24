var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var cors = require('cors');
var expressApp = express();
var path = require('path');
var MIFU = require('./calculations/ScriptReportNew.js');

var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

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

expressApp.post('/uploadSourceFile', upload.any(), function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(req.files[0].originalname);
  fs.renameSync('./'+req.files[0].originalname, __dirname+'/workdir/input/'+req.files[0].originalname)
  res.send('plop');
  res.status(204).end();
});

expressApp.get('/genMIFU', function (req, res) {
  var vdbPath = __dirname + '/workdir/input/Extrait_VDB.xlsx';
  var spiPath = __dirname + '/workdir/input/Extrait_SPI.xlsx';
  var pdmsPath = __dirname + '/workdir/input/Extrait_PDMS.xls';
  var previousMIFUPath = __dirname + '/workdir/input/previous_MIFU.xlsx';

  var targetPath = __dirname + '/workdir/output/newMIFU.xlsx';

  var statusMIFU = MIFU.generateMIFU(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath);

  res.download(targetPath); // Set disposition and send it.

});


var server = expressApp.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example expressApp listening at http://%s:%s', host, port);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:8888');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
