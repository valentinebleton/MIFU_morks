
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
    return rev.date == Math.max.apply(null, revs.map(function(r) {return r.date}));
  })[0];
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

module.exports = {
  importVendorDocs : importVendorDocs,
  VendorDoc : VendorDoc,
  Revision : Revision
};
