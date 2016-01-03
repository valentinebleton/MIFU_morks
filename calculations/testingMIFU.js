var MIFU = require('./calculations/ScriptReportNew.js');

var vdbPath = __dirname + '/sourceFiles/Extrait_VDB.xlsx';
var spiPath = __dirname + '/sourceFiles/Extrait_SPI.xlsx';
var pdmsPath = __dirname + '/sourceFiles/Extrait_PDMS.xls';
var previousMIFUPath = __dirname + '/sourceFiles/previous_MIFU.xlsx';

var targetPath = __dirname + '/output/newMIFU.xlsx';

var statusMIFU = MIFU.generateMIFU(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath);
