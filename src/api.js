var exportUrl = "http://export.highcharts.com/";
// var exportUrl = "http://localhost:7801/";

function addImage(options, selector) {
  var optionsStr = JSON.stringify(options),
    dataString = encodeURI(
      "async=true&type=jpeg&scale=3&options=" + optionsStr
    );

  $.ajax({
    type: "POST",
    data: dataString,
    url: exportUrl,
    success: function(data) {
      console.log("get the file from relative url: ", data);
      // $(selector).html('<img src="' + exportUrl + data + '"/>');
      // $(selector).attr("src", exportUrl + data);
      $(selector).attr("src", exportUrl + data);
      // console.log(selector);
      var test = $("html")
        .clone()
        .html();
      window.test = test;
    },
    error: function(err) {
      console.log("error", err.statusText);
    }
  });
}

function createDepartmentChartOptions(params) {
  var options = {
    chart: {
      type: "column"
    },
    credits: {
      enabled: false
    },
    title: {
      text: null
    },
    xAxis: {
      categories: params.departments
    },
    yAxis: {
      min: 0,
      title: {
        text: params.title
      }
    },
    exporting: {
      sourceHeight: 350,
      chartOptions: { subtitle: null }
    },
    series: [params.thisMonthData, params.lastMonthData]
  };

  return options;
}

function createDepartmentImages() {
  var params = {};

  // Incase, new depts added or removed in the current month, so, take the month with more departments
  var allDepartments =
    Data.thisMonth.departments.length > Data.lastMonth.departments.length
      ? Data.thisMonth.departments
      : Data.lastMonth.departments;

  params.departments = allDepartments.map(function(dept) {
    return dept.name;
  });

  var thisMonthDepartments = Data.thisMonth.departments;
  var lastMonthDepartments = Data.lastMonth.departments;

  var thisMonthData = { name: "Jun 2018", data: [] };
  var lastMonthData = { name: "May 2018", data: [] };

  thisMonthDepartments.forEach(function(dept) {
    thisMonthData.data.push(dept.time);
  });

  lastMonthDepartments.forEach(function(dept) {
    lastMonthData.data.push(dept.time);
  });

  params.title = "Total Time";

  params.thisMonthData = thisMonthData;
  params.lastMonthData = lastMonthData;

  var totalTimeChartOptions = createDepartmentChartOptions(params);

  console.log(JSON.stringify(totalTimeChartOptions));

  addImage(totalTimeChartOptions, ".dept_total_time_chart");

  /// For Sessions
  /// Only series data in params needs to be changed

  thisMonthData.data = [];
  lastMonthData.data = [];

  thisMonthDepartments.forEach(function(dept) {
    thisMonthData.data.push(dept.sessions);
  });

  lastMonthDepartments.forEach(function(dept) {
    lastMonthData.data.push(dept.sessions);
  });

  params.title = "Total Sessions";

  params.thisMonthData = thisMonthData;
  params.lastMonthData = lastMonthData;

  var totalSessionsChartOptions = createDepartmentChartOptions(params);

  console.log(JSON.stringify(totalSessionsChartOptions));

  addImage(totalSessionsChartOptions, ".dept_total_sessions_chart");
}

$(document).ready(function() {
  createDepartmentImages();
});
