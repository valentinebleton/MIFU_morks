'use strict';

const XLSX = require('xlsx');
const fs = require('fs');
const instrumentHelpers = require('./helpers/instrumentHelpers.js');
const vendorDocHelpers = require('./helpers/vendorDocHelpers.js');
const g = require('./helpers/globalHelpers.js');
const isometricHelpers = require('./helpers/isometricHelpers.js');
const log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file',
      filename: './output/reportErrorsIsoNew.log',
      category: 'isoMifu',
    },
  ]
});

let generateISOS = function(vdbPath, spiPath, pdmsPath, bomPath, impactedIsosPath, previousMIFUPath, targetPath) {

  let logger = log4js.getLogger('lostData');
  logger.setLevel('ALL');

  let vdbWorkbook = XLSX.readFileSync(vdbPath);
  let vdbData = XLSX.utils.sheet_to_json(vdbWorkbook.Sheets[vdbWorkbook.SheetNames[0]]);
  let spiWorkbook = XLSX.readFileSync(spiPath);
  let spiData = XLSX.utils.sheet_to_json(spiWorkbook.Sheets[spiWorkbook.SheetNames[0]]);
  let pdmsWorkbook = XLSX.readFileSync(pdmsPath);
  let pdmsData = XLSX.utils.sheet_to_json(pdmsWorkbook.Sheets[pdmsWorkbook.SheetNames[0]]);
  let bomWorkbook = XLSX.readFileSync(bomPath);
  let bomData = XLSX.utils.sheet_to_json(bomWorkbook.Sheets[bomWorkbook.SheetNames[0]]);
  let impactedIsosWorkbook = XLSX.readFileSync(impactedIsosPath);
  let impactedIsosData = XLSX.utils.sheet_to_json(impactedIsosWorkbook.Sheets[impactedIsosWorkbook.SheetNames[0]]);
  let previousMIFUWorkbook = XLSX.readFileSync(previousMIFUPath);
  let previousMIFUData = XLSX.utils.sheet_to_json(previousMIFUWorkbook.Sheets[previousMIFUWorkbook.SheetNames[0]]);

  let vendorDocs = vendorDocHelpers.importVendorDocs(vdbData, logger);
  let instruments = instrumentHelpers.importInstruments(spiData, pdmsData, previousMIFUData, logger);
  let isometrics = isometricHelpers.importIsometrics(bomData, pdmsData, impactedIsosData, logger);
  isometrics.forEach(function(isometric) {isometric.updateOnHoldCount(instruments, vendorDocs, logger)});
  isometrics.forEach(function(isometric,ind, arr) {isometric.updateOnHoldImpactedIsoCount(arr)});
  isometrics.forEach(function(isometric) {isometric.updateIFCStatus()});
  isometrics.forEach(function(isometric) {isometric.updateForecastDatesCompiled(instruments, logger)});
  let tempData = isometrics.map(isometricHelpers.exportFunction);

  let buffer = g.json2xlsx([{jsonArray: tempData, sheetTitle: 'Isometrics'}]);

  fs.writeFileSync(targetPath, buffer);

  return 'OK';

}

module.exports = {
  generateISOS : generateISOS,
};
