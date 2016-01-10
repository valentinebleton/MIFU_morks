var ISOS = require('./ScriptReportIsos.js');

var vdbPath = __dirname + '/sourceFiles/Extrait_VDB.xlsx';
var spiPath = __dirname + '/sourceFiles/Extrait_SPI.xlsx';
var pdmsPath = __dirname + '/sourceFiles/Extrait_PDMS.xls';
var bomPath = __dirname + '/sourceFiles/BOM.xlsx';
var impactedIsosPath = __dirname + '/sourceFiles/Impacted_iso.xlsx';
var previousMIFUPath = __dirname + '/sourceFiles/previous_MIFU.xlsx';

var targetPath = __dirname + '/output/newISOS.xlsx';

var statusISOS = ISOS.generateISOS(vdbPath, spiPath, pdmsPath, bomPath, impactedIsosPath, previousMIFUPath, targetPath);
