var xlsx = require('node-xlsx');
var fs = require('fs');
var mifuHelpers = require('./helpers/mifuHelpersNew.js');
var instrumentHelpers = require('./helpers/instrumentHelpers.js');
var vendorDocHelpers = require('./helpers/vendorDocHelpers.js');

var generateMIFU = function(vdbPath, spiPath, pdmsPath, previousMIFUPath, targetPath) {
  var vdb = xlsx.parse(vdbPath);
  vdb[0].data.shift();
  var spi = xlsx.parse(spiPath);
  spi[0].data.shift();
  var pdms = xlsx.parse(pdmsPath);
  pdms[0].data.shift();
  var previousMIFU = xlsx.parse(previousMIFUPath);
  previousMIFU[0].data.shift();

  var vendorDocs = vendorDocHelpers.importVendorDocs(vdb[0].data);
  var Instruments = instrumentHelpers.importInstruments(spi[0].data, pdms[0].data, previousMIFU[0].data);

  var tempData = Instruments.map(function(inst) {return(mifuHelpers.newFunc(inst, vendorDocs))});

  var res = [
    {name: 'Instrum',
      data: [
        ['TAG','Doc_Client_Reference', 'Code_1', 'Code_2', 'Code_3','Latest Revision Status','Latest revision Date','Latest revision #', 'PDMS Status', 'Initial forecast date Code 2', 'Latest forecast date Code 2','Count of changes Forecast date Code 2', 'Initial forecast date Code 3', 'Latest forecast date Code 3', 'Count of changes Forecast date Code 3']
      ]
    }
  ];

  res[0].data = res[0].data.concat(tempData);
  var buffer = xlsx.build(res);

  fs.writeFileSync(targetPath, buffer, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });

  return 'OK';
}

module.exports = {
  generateMIFU : generateMIFU
};
