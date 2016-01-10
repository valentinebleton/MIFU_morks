'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const exportHelpers = require('./helpers/exportHelpers.js');
const instrumentHelpers = require('./helpers/instrumentHelpers.js');
const vendorDocHelpers = require('./helpers/vendorDocHelpers.js');
const g = require('./helpers/globalHelpers.js');

let generateMIFU = function(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath) {
  let vdbWorkbook = XLSX.readFileSync(vdbPath);
  let vdbData = XLSX.utils.sheet_to_json(vdbWorkbook.Sheets[vdbWorkbook.SheetNames[0]]);
  let spiWorkbook = XLSX.readFileSync(spiPath);
  let spiData = XLSX.utils.sheet_to_json(spiWorkbook.Sheets[spiWorkbook.SheetNames[0]]);
  let pdmsWorkbook = XLSX.readFileSync(pdmsPath);
  let pdmsData = XLSX.utils.sheet_to_json(pdmsWorkbook.Sheets[pdmsWorkbook.SheetNames[0]]);
  let previousMIFUWorkbook = XLSX.readFileSync(previousMIFUPath);
  let previousMIFUData = XLSX.utils.sheet_to_json(previousMIFUWorkbook.Sheets[previousMIFUWorkbook.SheetNames[0]]);

  let vendorDocs = vendorDocHelpers.importVendorDocs(vdbData);
  let Instruments = instrumentHelpers.importInstruments(spiData, pdmsData, previousMIFUData);
  let tempData = Instruments.map(function(inst) {return(exportHelpers.MIFU(inst, vendorDocs))});

  let buffer = g.json2xlsx([{jsonArray: tempData, sheetTitle: 'Instrum'}]);

  fs.writeFileSync(targetPath, buffer);

  return 'OK';

}

module.exports = {
  generateMIFU : generateMIFU,
};
