var isoUnicMIFU = require('./ScriptIsoUnicReportNew.js');

var vdbPath = __dirname + '/sourceFiles/Extrait_VDB.xlsx';
var spiPath = __dirname + '/sourceFiles/Extrait_SPI.xlsx';
var pdmsPath = __dirname + '/sourceFiles/Extrait_PDMS.xls';
var bomPath =  __dirname + '/sourceFiles/BOM.xlsx';
var impactedIsoPath = __dirname +'/sourceFiles/Impacted_iso.xlsx';
var previousMIFUPath = __dirname + '/sourceFiles/previous_MIFU.xlsx';

var unicIsoName = 'P00-30-HL-1020-0062-BD20H-HF1-1';
var targetPath = __dirname + '/output/newIsoUnicMIFU'.concat(unicIsoName).concat('.xlsx');

var statusIsoUnicMIFU = isoUnicMIFU.generateIsoUnicMIFU(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath);
