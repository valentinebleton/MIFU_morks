
Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

function Isometric(name, relatedTags, impactedIsometrics) {
  this.name = name;
  this.relatedTags = relatedTags;
  this.impactedIsometrics = impactedIsometrics;
  this.onHoldCount = 0;
  this.onHoldImpactedIsoCount = 0;
  this.IFCStatus = '';
}

Isometric.prototype.updateOnHoldCount = function (instruments, vendorDocs) {
  var onHoldCount = 0;
  if (this.relatedTags.length > 0) {
    this.relatedTags.forEach(function(relatedTag) {
      var relatedInstrument = instruments.filter(function(instrum) {
        return instrum.tag == relatedTag;
      })[0];
      if (typeof relatedInstrument != 'undefined') {
        var relatedvendorDoc = vendorDocs.filter(function(vendorDoc) {
          return vendorDoc.ref == relatedInstrument.gad;
        })[0];
        if (typeof relatedvendorDoc != 'undefined') {
          if ((typeof relatedvendorDoc.latestRevision.statusCode != 'number') || (typeof relatedInstrument.pdmsStatus  != 'number') || (relatedvendorDoc.latestRevision.statusCode < 2) || (relatedInstrument.pdmsStatus == 1)) {
            // TODO : gérer le cas PDMS non setté
            //console.log('plop');
            onHoldCount++;
          }
        }
      }
    });
  }
  this.onHoldCount = onHoldCount;
};

Isometric.prototype.updateOnHoldImpactedIsoCount = function (isometrics) {
  var onHoldImpactedIsoCount = 0;
  if (this.impactedIsometrics.length > 0) {
    this.impactedIsometrics.forEach(function(relatedIso) {
      var impactedIso = isometrics.filter(function(iso) {
        return (iso.name == relatedIso);
      })[0];
      if (impactedIso.onHoldCount > 0) {
        onHoldImpactedIsoCount++;
      }
    });
  }
  this.onHoldImpactedIsoCount = onHoldImpactedIsoCount;
};

Isometric.prototype.updateIFCStatus = function () {
  if ((this.onHoldCount == 0) && (this.onHoldImpactedIsoCount == 0)) {
    this.IFCStatus = 'ok';
  }
};

var importIsometrics = function(bomData, pdmsData, impactedIsoData) {
  var listIsoNames = bomData.map(function(l) {
    return l[4];
  }).unique();

  var newLines = listIsoNames.map(function(name) {
    // impacted Iso
    var a = impactedIsoData.filter(function(impactedIsoLine) {
      return (impactedIsoLine[0] == name);
    });

    if (typeof a != 'undefined') {
      var listImpactedIso = a.map(function(l) {
        return l[4];
      });
    } else {
      var listImpactedIso = [];
    };

    // related tags
    var b = pdmsData.filter(function(relatedTagLine) {
      return (relatedTagLine[3] == name);
    });

    if (typeof b != 'undefined') {
      var listRelatedTags = b.map(function(l) {
        return l[0];
      });
    } else {
      var listRelatedTags = [];
    };

    var newIsometric = new Isometric(name, listRelatedTags, listImpactedIso);
    return newIsometric;
  });
  return newLines;
}


var exportFunction = function(isometric) {
  return [isometric.name,isometric.onHoldCount,isometric.onHoldImpactedIsoCount, isometric.IFCStatus];
}

module.exports = {
  importIsometrics : importIsometrics,
  Isometric : Isometric,
  exportFunction : exportFunction
};
