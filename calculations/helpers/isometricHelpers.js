
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
  var self = this;
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
      } else {
        onHoldCount++;
        // TODO : gérer le cas où le tag est dans le PDMS et pas dans le SPI
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
        return (iso.name == relatedIso.impactedIso);
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
  var listIsoNames = bomData.map(function(bomObj) {
    return bomObj['Isometric'];
  }).unique();

  var newLines = listIsoNames.map(function(name) {
    // impacted Iso
    var a = impactedIsoData.filter(function(impactedIsoObj) {
      return (impactedIsoObj['Isometric'] == name);
    });

    if (typeof a != 'undefined') {
      var listImpactedIso = a.map(function(isoObj) {
        return {impactedIso : isoObj['Impacted isometric'], impactingTag: isoObj['Isometric']};
      });
    } else {
      var listImpactedIso = [];
    };

    // related tags
    var b = pdmsData.filter(function(relatedTagObj) {
      return (relatedTagObj['PIPE'] == name);
    });

    if (typeof b != 'undefined') {
      var listRelatedTags = b.map(function(pdmsObj) {
        return pdmsObj['NAME'];
      });
    } else {
      var listRelatedTags = [];
    };

    var newIsometric = new Isometric(name, listRelatedTags, listImpactedIso);
    return newIsometric;
  });
  return newLines;
}

// fonction d'import pour un isométrique unique appelé IsoName
var uniqueExportFunction = function(isometrics, instruments, vendorDocs, isoName) {
  var targetedIso = isometrics.filter(function(iso) {
    return iso.name == isoName;
  })[0];

  var temp1 = targetedIso.relatedTags.map(function(relatedTagName) {

    var relatedTag = instruments.filter(function(instrum) {
      return instrum.tag == relatedTagName;
    })[0];

    var relatedVendorDoc = vendorDocs.filter(function(vendorDoc) {
      return vendorDoc.ref == relatedTag.gad;
    })[0];
    return {
      'Tag' : relatedTag.tag,
      'Status VDB' : relatedVendorDoc.latestRevision.statusCode,
      'Status PDMS' : relatedTag.pdmsStatus,
    };
  });

  var temp2 = targetedIso.impactedIsometrics.map(function(iso) {
    var impactedIso = isometrics.filter(function(is) {
      return is.name == iso.impactedIso;
    })[0];
    return {
      'Impacted isometric' : iso.impactedIso,
      'tag of impacting element' : iso.impactingTag,
      'global status of impacted isometric' : impactedIso.IFCStatus,
    };
  });

  return [temp1, temp2];
}

var exportFunction = function(isometric) {
  return {
    'Isometric' : isometric.name,
    'number of HOLD on iso' : isometric.onHoldCount,
    'Status of impacted isometrics' : isometric.onHoldImpactedIsoCount,
    'IFC ready' : isometric.IFCStatus,
  };
}


module.exports = {
  importIsometrics : importIsometrics,
  uniqueExportFunction : uniqueExportFunction,
  Isometric : Isometric,
  exportFunction : exportFunction
};
