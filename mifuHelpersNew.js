
function Instrument(tag, gad, pdmsStatus, forecastDates) {
  this.tag = tag;
  this.gad = gad;
  this.pdmsStatus = pdmsStatus;
  this.forecastDates = forecastDates;
}

function VendorDoc(ref, revisions) {
  this.ref = ref;
  this.revisions = revisions;
  this.statusCodes = [1,2,3].map(function(n) {
    var dateStatusCode = 0;
    revisions.forEach(function(rev) {
      if ((rev.date > dateStatusCode) && ( rev.statusCode == n ) ) {
        dateStatusCode = rev.date;
      }
    });
    return {code: n, latestDate: dateStatusCode};
  });
  this.latestRevision = 'plip';
}

VendorDoc.prototype.calculateLatestRevision = function () {
  var revs = this.revisions;
  this.latestRevision = revs.filter(function(rev) {
    return rev.date == Math.max(...revs.map(function(r) {return r.date}));
  })[0];
};

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

function Revision(number, date, statusCode) {
  this.number = number;
  this.date = date;
  this.statusCode = statusCode;
}

var importVendorDocs = function(vdbData) {
  var newVendorDocs = [];
  vdbData.forEach(function(line) {
    var i = 0;
    var l = newVendorDocs.length;
    var index = -1;
    for(i = 0; i < l; i++) {
      if (newVendorDocs[i].ref == line[0]) {
          index = i;
          break;
      }
    }
    if (index < 0) {
      if ((typeof line[2] != 'undefined') && (typeof line[3] != 'undefined')) {
        var revision = new Revision(line[2], line[3], line[5]);
        var newVendorDoc = new VendorDoc(line[0], [revision]);
        newVendorDocs.push(newVendorDoc);
      } else {
        // console.log('Erreur : ligne VDB '+line[0]+' mal remplie');
      }
    } else {
      var revision = new Revision(line[2], line[3], line[5]);
      newVendorDocs[index].revisions.push(revision);
    }
  });
  newVendorDocs.forEach(function(vendorDoc) {
    vendorDoc.calculateLatestRevision();
  });
  return newVendorDocs;
}

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

    var newInstrum = new Instrument(line[0],line[10],pdmsStatus,[forecastDate2, forecastDate3]);
    return  newInstrum;
  });
  return newLines;
}

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
  importInstruments : importInstruments,
  importVendorDocs : importVendorDocs,
  Instrument : Instrument,
  VendorDoc : VendorDoc,
  ForecastDate : ForecastDate,
  Revision : Revision,
  newFunc : newFunc
};
