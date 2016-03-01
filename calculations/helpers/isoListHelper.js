var XLSX = require('xlsx');

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

var getIsoNameList = function(bomPath) {
  var bomWorkbook = XLSX.readFileSync(bomPath);
  var bomData = XLSX.utils.sheet_to_json(bomWorkbook.Sheets[bomWorkbook.SheetNames[0]]);
  var listIsoNames = bomData.map(function(bomObj) {
    return bomObj['Isometric'];
  }).unique();
  return listIsoNames;
}

module.exports = {
  getIsoNameList : getIsoNameList,
};
