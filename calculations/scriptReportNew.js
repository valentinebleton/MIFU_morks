'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const instrumentHelpers = require('./helpers/instrumentHelpers.js');
const vendorDocHelpers = require('./helpers/vendorDocHelpers.js');
const g = require('./helpers/globalHelpers.js');
const log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file',
      filename: './output/reportErrorsNew.log',
      category: 'mifu',
    },
  ]
});

let generateMIFU = function(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath) {

  let logger = log4js.getLogger('lostData');
  logger.setLevel('ALL');

  let vdbWorkbook = XLSX.readFileSync(vdbPath);
  let vdbData = XLSX.utils.sheet_to_json(vdbWorkbook.Sheets[vdbWorkbook.SheetNames[0]]);
  let spiWorkbook = XLSX.readFileSync(spiPath);
  let spiData = XLSX.utils.sheet_to_json(spiWorkbook.Sheets[spiWorkbook.SheetNames[0]]);
  let pdmsWorkbook = XLSX.readFileSync(pdmsPath);
  let pdmsData = XLSX.utils.sheet_to_json(pdmsWorkbook.Sheets[pdmsWorkbook.SheetNames[0]]);
  let previousMIFUWorkbook = XLSX.readFileSync(previousMIFUPath);
  let previousMIFUData = XLSX.utils.sheet_to_json(previousMIFUWorkbook.Sheets[previousMIFUWorkbook.SheetNames[0]]);

  let vendorDocs = vendorDocHelpers.importVendorDocs(vdbData, logger);
  let Instruments = instrumentHelpers.importInstruments(spiData, pdmsData, previousMIFUData, logger);
  let tempData = Instruments.map(function(inst) {return(instrumentHelpers.exportMIFU(inst, vendorDocs, logger))});

  let buffer = g.json2xlsx([{jsonArray: tempData, sheetTitle: 'Instrum'}]);

  fs.writeFileSync(targetPath, buffer);

  return 'OK';

}

module.exports = {
  generateMIFU : generateMIFU,
};
