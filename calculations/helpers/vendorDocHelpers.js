var g = require('./globalHelpers.js');

function VendorDoc(ref, revisions) {
  this.ref = ref;
  this.revisions = revisions;
  this.statusCodes = [1,2,3].map(function(n) {
    var dateStatusCode = 0;
    revisions.forEach(function(rev) {
      if ((rev.date.getTime() > dateStatusCode) && ( rev.statusCode == n ) ) {
        dateStatusCode = rev.date;
      }
    });
    return {code: n, latestDate: dateStatusCode};
  });
  this.latestRevision = 'plip';
}

VendorDoc.prototype.calculateLatestRevision = function () {
  var revs = this.revisions;
  var self = this;
  var maxDate = new Date(Math.max.apply(null, revs.map(function(r) {return r.date})));
  this.latestRevision = revs.filter(function(rev,ind,arr) {
    return rev.date.getTime() == maxDate.getTime();
  })[0];
};

function Revision(number, date, statusCode) {
  this.number = number;
  this.date = date;
  this.statusCode = statusCode;
}

var importVendorDocs = function(vdbData, logger) {
  var newVendorDocs = [];
  vdbData.forEach(function(vd) {
    var i = 0;
    var l = newVendorDocs.length;
    var index = -1;
    for(i = 0; i < l; i++) {
      if (newVendorDocs[i].ref == vd['Doc_Client_Reference']) {
          index = i;
          break;
      }
    }
    if (index < 0) {
      if ((typeof vd['Rev'] != 'undefined') && (typeof vd['Rev_Date'] != 'undefined')) {
        //console.log(vd['Rev_Date']);
        var revision = new Revision(vd['Rev'], g.dateImport(vd['Rev_Date']), vd['Doc_Status']);
        var newVendorDoc = new VendorDoc(vd['Doc_Client_Reference'], [revision]);
        newVendorDocs.push(newVendorDoc);
      } else {
        logger.warn(vd['Doc_Client_Reference']+' data in VDB is wrongly filled');
      }
    } else {
      var revision = new Revision(vd['Rev'], g.dateImport(vd['Rev_Date']), vd['Doc_Status']);
      newVendorDocs[index].revisions.push(revision);
    }
  });
  newVendorDocs.forEach(function(vendorDoc) {
    vendorDoc.calculateLatestRevision();
  });
  return newVendorDocs;
}

module.exports = {
  importVendorDocs : importVendorDocs
};
