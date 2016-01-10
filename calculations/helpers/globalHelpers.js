var nodeXlsx = require('node-xlsx');

var dateImport = function(dateString) {
  debugger;
  var dateParts = dateString.split(' ')[0].split('/');
  var date = new Date('20'+dateParts[2], (dateParts[0]-1), dateParts[1]);
  return date;
}

var dateExport = function(date) {
  if (date == 0) {
    return '';
  } else {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return day+'/'+month+'/'+year;
  }
}

var json2xlsx = function(preWorksheets) {

  var ress = preWorksheets.map(function(preWorksheet) {
    var titles = [Object.keys(preWorksheet.jsonArray[0])];
    var data = preWorksheet.jsonArray.map(function(jsonObj) {
      return titles[0].map(function(key) { return jsonObj[key]});
    });
    var allData = titles.concat(data);
    var res = {
        name: preWorksheet.sheetTitle,
        data: allData,
    };
    return res;
  });

  var buffer = nodeXlsx.build(ress);
  return buffer;
}

module.exports = {
  dateImport : dateImport,
  dateExport : dateExport,
  json2xlsx : json2xlsx,
};
