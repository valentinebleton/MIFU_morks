var g = require('./globalHelpers.js');

var MIFU = function(instrument, vendorDocs) {

  if ((instrument.gad != 'Preliminary') && (instrument.gad != 'No action') && (instrument.gad != 'Not available')) {
    var gad = vendorDocs.filter(function(vendorDoc) {
      return vendorDoc.ref == instrument.gad;
    })[0];

    var forecastDate2 = instrument.forecastDates.filter(function(fD) {return (fD.statusCode == 2);})[0];
    var forecastDate3 = instrument.forecastDates.filter(function(fD) {return (fD.statusCode == 3);})[0];

    if (typeof gad != 'undefined') {
      return {
        'TAG': instrument.tag,
        'Doc_Client_Reference': gad.ref,
        'Code_1': g.dateExport(gad.statusCodes[0].latestDate),
        'Code_2': g.dateExport(gad.statusCodes[1].latestDate),
        'Code_3': g.dateExport(gad.statusCodes[2].latestDate),
        'Latest Revision Status': gad.latestRevision.statusCode,
        'Latest revision Date': g.dateExport(gad.latestRevision.date),
        'Latest revision #': gad.latestRevision.number,
        'PDMS Status': instrument.pdmsStatus,
        'Initial forecast date Code 2': g.dateExport(forecastDate2.initialDate),
        'Latest forecast date Code 2': g.dateExport(forecastDate2.latestDate),
        'Count of changes Forecast date Code 2': forecastDate2.dateChangeCount,
        'Initial forecast date Code 3': g.dateExport(forecastDate3.initialDate),
        'Latest forecast date Code 3': g.dateExport(forecastDate3.latestDate),
        'Count of changes Forecast date Code 3': forecastDate3.dateChangeCount,
      };

    } else {
      return {
        'TAG': instrument.tag,
        'Doc_Client_Reference': instrument.gad,
      };
    }
  } else {
    return {
      'TAG': instrument.tag,
      'Doc_Client_Reference': instrument.gad,
    };
  }
}

module.exports = {
  MIFU : MIFU,
};
