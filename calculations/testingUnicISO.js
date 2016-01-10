var ISOS = require('./ScriptReportUnicIsoNew.js');

var vdbPath = __dirname + '/sourceFiles/Extrait_VDB.xlsx';
var spiPath = __dirname + '/sourceFiles/Extrait_SPI.xlsx';
var pdmsPath = __dirname + '/sourceFiles/Extrait_PDMS.xls';
var bomPath = __dirname + '/sourceFiles/BOM.xlsx';
var impactedIsosPath = __dirname + '/sourceFiles/Impacted_iso.xlsx';
var previousMIFUPath = __dirname + '/sourceFiles/previous_MIFU.xlsx';

var unicIsoName = 'P00-30-HL-1020-0062-BD20H-HF1-1';

var targetPath = __dirname + '/output/'+unicIsoName+'_Unic_Iso_report.xlsx';

var statusISOS = ISOS.generateUnicISO(vdbPath, spiPath, pdmsPath, bomPath, impactedIsosPath, previousMIFUPath, targetPath, unicIsoName);
