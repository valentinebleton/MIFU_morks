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

var importInstruments = function(spiData, pdmsData, previousMIFU, logger) {
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
      logger.warn(inst['INSTRUM Tag']+' missing in PDMS File');
      var pdmsStatus = '';
    };

    var newInstrum = new Instrument(inst['INSTRUM Tag'],inst['GAD \r\ndoc. number (VDB)'], pdmsStatus, [forecastDate2, forecastDate3]);
    return  newInstrum;
  });
  return newLines;
}

var exportMIFU = function(instrument, vendorDocs, logger) {

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
      logger.warn(inst[instrument.tag]+' no GAD reference in SPI extract');
    }
  } else {
    return {
      'TAG': instrument.tag,
      'Doc_Client_Reference': instrument.gad,
    };
    logger.warn(inst[instrument.tag]+' GAD information not mature enough');
  }
}

module.exports = {
  importInstruments: importInstruments,
  exportMIFU: exportMIFU,
};
