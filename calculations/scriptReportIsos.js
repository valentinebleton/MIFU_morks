var xlsx = require('node-xlsx');
var fs = require('fs');
var mifuHelpers = require('./helpers/mifuHelpersNew.js');
var instrumentHelpers = require('./helpers/instrumentHelpers.js');
var vendorDocHelpers = require('./helpers/vendorDocHelpers.js');
var isometricHelpers = require('./helpers/isometricHelpers.js');

var vdb = xlsx.parse('./sourceFiles/Extrait_VDB.xlsx');
vdb[0].data.shift();
var spi = xlsx.parse('./sourceFiles/Extrait_SPI.xlsx');
spi[0].data.shift();
var pdms = xlsx.parse('./sourceFiles/Extrait_PDMS.xls');
pdms[0].data.shift();
var bom = xlsx.parse('./sourceFiles/BOM.xlsx');
bom[0].data.shift();
var impactedIso = xlsx.parse('./sourceFiles/Impacted_iso.xlsx');
impactedIso[0].data.shift();
var previousMIFU = xlsx.parse('./sourceFiles/previous_MIFU.xlsx');
previousMIFU[0].data.shift();

//if (typeof previousMIFU == 'undefined') {
  var tempData = [];
//}
var vendorDocs = vendorDocHelpers.importVendorDocs(vdb[0].data);
var instruments = instrumentHelpers.importInstruments(spi[0].data, pdms[0].data, previousMIFU[0].data);

var isometrics = isometricHelpers.importIsometrics(bom[0].data, pdms[0].data, impactedIso[0].data);

isometrics.forEach(function(isometric) {isometric.updateOnHoldCount(instruments, vendorDocs)});
isometrics.forEach(function(isometric,ind, arr) {isometric.updateOnHoldImpactedIsoCount(arr)});
isometrics.forEach(function(isometric) {isometric.updateIFCStatus()});

var tempData = isometrics.map(isometricHelpers.exportFunction);

var res = [
  {name: 'Instrum',
    data: [
      ['Isometric','number of HOLD on iso','Status of impacted isometrics','IFC ready']
    ]
  }
];

res[0].data = res[0].data.concat(tempData);
var buffer = xlsx.build(res);

fs.writeFileSync('./output/ISO_MIFU_report.xlsx', buffer, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
