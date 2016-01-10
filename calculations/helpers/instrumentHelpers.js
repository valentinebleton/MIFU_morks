var g = require('./globalHelpers.js');

function Instrument(tag, gad, pdmsStatus, forecastDates) {
  this.tag = tag;
  this.gad = gad;
  this.pdmsStatus = pdmsStatus;
  this.forecastDates = forecastDates;
}

function ForecastDate(date, statusCode) {
  this.initialDate = date;
  this.latestDate = date;
  this.dateChangeCount = 0;
  this.statusCode = statusCode;
}

ForecastDate.prototype.updateForecastDate = function (initialDate, latestDate, dateChangeCount) {
  this.initialDate = new Date(initialDate);
  if (this.latestDate.getTime() != latestDate.getTime()) {
    this.dateChangeCount++;
  };
};

var importInstruments = function(spiData, pdmsData, previousMIFU) {
  var newLines = spiData.map(function(inst) {
    var forecastDate2 = new ForecastDate(g.dateImport(inst['Forecast date Code 2']), 2);
    var forecastDate3 = new ForecastDate(g.dateImport(inst['Forecast date Code 3']), 3);

    var pMIFUl = previousMIFU.filter(function(obj) {return (obj['TAG'] == inst['INSTRUM Tag'])})[0];

    if (typeof pMIFUl != 'undefined') {
      forecastDate2.updateForecastDate(g.dateImport(pMIFUl['Initial forecast date Code 2']), g.dateImport(pMIFUl['Latest forecast date Code 2']), pMIFUl['Count of changes Forecast date Code 2']);
      forecastDate3.updateForecastDate(g.dateImport(pMIFUl['Initial forecast date Code 3']), g.dateImport(pMIFUl['Latest forecast date Code 3']), pMIFUl['Count of changes Forecast date Code 3']);
    }

    var a = pdmsData.filter(function(pdmsObj) {
      return (pdmsObj['NAME'] == inst['INSTRUM Tag']);
    })[0];
    if (typeof a != 'undefined') {
      var pdmsStatus = a['STATUS'];
    } else {
      var pdmsStatus = '';
    };

    var newInstrum = new Instrument(inst['INSTRUM Tag'],inst['GAD \r\ndoc. number (VDB)'], pdmsStatus, [forecastDate2, forecastDate3]);
    return  newInstrum;
  });
  return newLines;
}

module.exports = {
  importInstruments : importInstruments
};
