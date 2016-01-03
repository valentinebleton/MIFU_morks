
function Instrument(tag, gad, pdmsStatus, forecastDates) {
  this.tag = tag;
  this.gad = gad;
  this.pdmsStatus = pdmsStatus;
  this.forecastDates = forecastDates;
}

function ForecastDate(date, statusCode) {
  this.initialDate = Math.floor(date);
  this.latestDate = Math.floor(date);
  this.dateChangeCount = 0;
  this.statusCode = statusCode;
}

ForecastDate.prototype.updateForecastDate = function (initialDate, latestDate, dateChangeCount) {
  this.initialDate = Math.floor(initialDate);
  if (this.latestDate != Math.floor(latestDate)) {
    this.dateChangeCount++;
  }
  this.latestDate = Math.floor(latestDate);
};

var importInstruments = function(spiData, pdmsData, previousMIFU) {
  var newLines = spiData.map(function(line) {
    var forecastDate2 = new ForecastDate(line[11], 2);
    var forecastDate3 = new ForecastDate(line[12], 3);

    var previousMIFUline = previousMIFU.filter(function(l) {return (l[0] == line[0])})[0];

    if (typeof previousMIFUline != 'undefined') {
      forecastDate2.updateForecastDate(previousMIFUline[9], previousMIFUline[10], previousMIFUline[11]);
      forecastDate3.updateForecastDate(previousMIFUline[12], previousMIFUline[13], previousMIFUline[14]);
    }

    var a = pdmsData.filter(function(pdmsLine) {
      return (pdmsLine[0] == line[0]);})[0];
    if (typeof a != 'undefined') {
      var pdmsStatus = a[8];
    } else {
      var pdmsStatus = '';
    };

    var newInstrum = new Instrument(line[0],line[10], pdmsStatus, [forecastDate2, forecastDate3]);
    return  newInstrum;
  });
  return newLines;
}

module.exports = {
  importInstruments : importInstruments,
  Instrument : Instrument,
  ForecastDate : ForecastDate
};
