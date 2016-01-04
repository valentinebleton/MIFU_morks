var xlsx = require('node-xlsx');
var fs = require('fs');
var mifuHelpers = require('./helpers/mifuHelpersNew.js');
var instrumentHelpers = require('./helpers/instrumentHelpers.js');
var vendorDocHelpers = require('./helpers/vendorDocHelpers.js');
var isometricHelpers = require('./helpers/isometricHelpers.js');

var generateIsoMIFU = function(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath) {
  var vdb = xlsx.parse(vdbPath);
  vdb[0].data.shift();
  var spi = xlsx.parse(spiPath);
  spi[0].data.shift();
  var pdms = xlsx.parse(pdmsPath);
  pdms[0].data.shift();
  var bom = xlsx.parse(bomPath);
  bom[0].data.shift();
  var impactedIso = xlsx.parse(impactedIsoPath);
  impactedIso[0].data.shift();
  var previousMIFU = xlsx.parse(previousMIFUPath);
  previousMIFU[0].data.shift();

var unicIsoName = 'P00-30-HL-1020-0062-BD20H-HF1-1';

//if (typeof previousMIFU == 'undefined') {
  var tempData = [];
//}
var vendorDocs = vendorDocHelpers.importVendorDocs(vdb[0].data);
var instruments = instrumentHelpers.importInstruments(spi[0].data, pdms[0].data, previousMIFU[0].data);
var isometrics = isometricHelpers.importIsometrics(bom[0].data, pdms[0].data, impactedIso[0].data);
isometrics.forEach(function(isometric) {isometric.updateOnHoldCount(instruments, vendorDocs)});
isometrics.forEach(function(isometric,ind, arr) {isometric.updateOnHoldImpactedIsoCount(arr)});
isometrics.forEach(function(isometric) {isometric.updateIFCStatus()});

var res = [
  {name: 'Instrum',
    data: [
      ['Tag','Status VDB','Status PDMS']
    ]
  },
  {name: 'Impacted isos',
    data: [
      ['Impacted isometric', 'tag of impacting element', 'global status of impacted isometric']
    ]
  }
];

// permet de remplir res[0]
var tempData = isometricHelpers.uniqueExportFunction(isometrics,instruments, vendorDocs, unicIsoName);

//console.log(tempData[0].slice(0,10));


res[0].data = res[0].data.concat(tempData[0]);
res[1].data = res[1].data.concat(tempData[1]);
var buffer = xlsx.build(res);

fs.writeFileSync(targetPath, buffer);
return 'OK';
}

module.exports = {
  generateIsoUnicMIFU : generateIsoUnicMIFU
};
