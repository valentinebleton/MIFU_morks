
var newFunc = function(instrument, vendorDocs) {

  if ((instrument.gad != 'Preliminary') && (instrument.gad != 'No action') && (instrument.gad != 'Not available')) {
    var gad = vendorDocs.filter(function(vendorDoc) {
      return vendorDoc.ref == instrument.gad;
    })[0];

    var forecastDate2 = instrument.forecastDates.filter(function(fD) {return (fD.statusCode == 2);})[0];
    var forecastDate3 = instrument.forecastDates.filter(function(fD) {return (fD.statusCode == 3);})[0];

    if (typeof gad != 'undefined') {

      return [instrument.tag, gad.ref, gad.statusCodes[0].latestDate, gad.statusCodes[1].latestDate,
      gad.statusCodes[2].latestDate, gad.latestRevision.statusCode, gad.latestRevision.date, gad.latestRevision.number,
      instrument.pdmsStatus, forecastDate2.initialDate, forecastDate2.latestDate, forecastDate2.dateChangeCount,
      forecastDate3.initialDate, forecastDate3.latestDate, forecastDate3.dateChangeCount ];

    } else {
      return [instrument.tag, instrument.gad, '', '', '', '', '', ''];
    }
  } else {
    return [instrument.tag, instrument.gad, '', '', '', '', '', ''];
  }
}

module.exports = {
  newFunc : newFunc
};
