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

function createPieChartOptions(
  data,
  isPercent = false,
  title,
  hidden = false,
  float = false
) {
  function getDataLabels() {
    if (isPercent) {
      return {
        enabled: true,
        format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
        distance: -50,
        filter: {
          property: "percentage",
          operator: ">",
          value: 4
        }
      };
    }
    var format = "<b>{point.name}</b><br>{point.y}";
    if (float) {
      format = "<b>{point.name}</b><br>{point.y:.1f}";
    }
    return {
      enabled: true,
      format: format,
      distance: -50,
      filter: {
        property: "percentage",
        operator: ">",
        value: 4
      }
    };
  }

  const options = {
    chart: hidden
      ? {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          margin: [0, 0, 0, 0]
        }
      : {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          margin: [0, 0, 0, 0]
        },
    credits: { enabled: false },
    title: {
      text: hidden ? null : title,
      align: "center",
      verticalAlign: "middle",
      y: 0,
      style: { fontSize: "25px" }
    },
    exporting: {
      sourceWidth: hidden ? 580 : 350,
      sourceHeight: hidden ? 50 : 350,
      chartOptions: { subtitle: null }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -30,
          format: "<b>{point.y:.0f}",
          style: { fontSize: "15px", textOutline: 0 }
        },
        showInLegend: hidden ? true : false
      }
    },
    series: [{ innerSize: "50%", data: data, visible: !hidden }]
  };
  // height: 20

  const returnValue = hidden
    ? Object.assign({}, options, {
        legend: {
          layout: "horizontal",
          align: "center",
          padding: 0,
          margin: 0,
          verticalAlign: "bottom",
          maxHeight: 200,
          floating: true
        }
      })
    : options;
  console.log(returnValue);

  return returnValue; // getDataLabels()
  // visible: !hidden
}

function createLineChartOptions(dataThisMonth, dataLastMonth, days, title) {
  return {
    chart: { type: "line" },
    credits: {
      enabled: false
    },
    title: { text: null },
    xAxis: { categories: days, title: { text: "Days" } },
    yAxis: { min: 0, title: { text: title }, gridLineWidth: 0 },
    plotOptions: {
      line: {
        dataLabels: { enabled: false, format: "<br>{point.y:.1f}" },
        pointInterval: 1
      }
    },
    exporting: {
      // sourceWidth: 350,
      // sourceHeight: 300,
      chartOptions: { subtitle: null }
    },
    legend: {
      layout: "horizontal",
      align: "right",
      margin: 0,
      verticalAlign: "top",
      maxHeight: 200,
      borderWidth: 2
    },
    series: [
      { name: "Jun", data: dataThisMonth },
      { name: "May", data: dataLastMonth }
    ]
  };
}

function generateImages() {
  // Department % Usage Pie Chart
  // var deptPercUsageData = [];
  // Object.keys(data.deptTimePercent).forEach(function(dept, i) {
  //   deptPercUsageData.push({
  //     name: dept,
  //     y: data.deptTimePercent[dept]
  //   });
  // });
  // const pieOne = createPieChartOptions(deptPercUsageData, true);

  // addImage(pieOne, ".pie__perc-usage img");

  // Department #Sessions Pie Chart
  var deptNoSessions = [];
  var deptNoSessionsTotal = 0;
  Object.keys(data.deptSessions).forEach(function(dept, i) {
    deptNoSessionsTotal += Number(data.deptSessions[dept]);
    deptNoSessions.push({
      name: dept,
      y: data.deptSessions[dept]
    });
  });

  // var pieOneContainer = $(".pie__no-sessions");
  const pieTwo = createPieChartOptions(
    deptNoSessions,
    false,
    deptNoSessionsTotal + "<br>Sessions"
  );

  // Highcharts.chart("pie1", pieTwo);
  addImage(pieTwo, "#pie1 img");

  // Department Session Time
  var deptSessionTimes = [];
  var deptSessionTimeTotal = 0;
  Object.keys(data.deptTimes).forEach(function(dept, i) {
    deptSessionTimeTotal += Number(data.deptTimes[dept]);

    deptSessionTimes.push({
      name: dept,
      y: parseInt(data.deptTimes[dept])
    });
  });

  const pieThree = createPieChartOptions(
    deptSessionTimes,
    false,
    Number(deptSessionTimeTotal).toFixed(2) + "<br> Hours"
  );
  // Highcharts.chart("pie2", pieThree);
  addImage(pieThree, "#pie2 img");

  var dummy = [];
  Object.keys(data.deptTimes).forEach(function(dept, i) {
    dummy.push({
      name: dept
    });
  });

  const pieFour = createPieChartOptions(
    dummy,
    false,
    "Secure <br> Time (hrs)",
    true
  );
  // Highcharts.chart("pie3", pieFour);
  addImage(pieFour, "#pie3 img");

  // const pieFour = createPieChartOptions(deptSessionTimes, false, true);
  // addImage(pieFour, ".pie__dummy img");

  // Secure Logged in Time for Users
  var sltForUsers = [];
  var thisMonthData = Object.values(data.timeThisMonthDic);
  var lastMonthData = Object.values(data.timeLastMonthDic);
  var days = [];
  var max = Math.max(thisMonthData.length, lastMonthData.length);

  for (var i = 1; i <= max; i++) {
    days.push(i);
  }

  const sltUsersOptions = createLineChartOptions(
    thisMonthData,
    lastMonthData,
    days,
    "Secure logged in time (hrs)"
  );
  // console.log(sltUsersOptions);

  addImage(sltUsersOptions, ".line__users-chart img");

  const sltComputersOptions = createLineChartOptions(
    thisMonthData,
    lastMonthData,
    days,
    "Secure Logged in Time for Computers (hrs)"
  );

  addImage(sltComputersOptions, ".line__computers-chart img");
}

function addDataValues() {
  $(".summary__users").text(data.users);
  $(".summary__computers").text(data.computers);
  $(".summary__sessions").text(data.sessionCount);
  $(".summary__slt").text(data.sessionTime);
  $(".daily__lt--lastmonth").text(
    Number(data.dailyAveragePerMonth.lastMonthSessionTimeAverage).toFixed(2)
  );
  $(".daily__sessions--lastmonth").text(
    Number(data.dailyAveragePerMonth.lastMonthSessionCountAverage)
  );
  $(".daily__users--lastmonth").text(
    Number(data.dailyAveragePerMonth.usersLastMonthAverage)
  );
  $(".daily__computers--lastmonth").text(
    Number(data.dailyAveragePerMonth.computersLastMonthAverage)
  );
  $(".daily__lt--thismonth").text(
    Number(data.dailyAveragePerMonth.thisMonthSessionTimeAverage).toFixed(2)
  );
  $(".daily__sessions--thismonth").text(
    Number(data.dailyAveragePerMonth.thisMonthSessionCountAverage)
  );
  $(".daily__users--thismonth").text(
    Number(data.dailyAveragePerMonth.usersThisMonthAverage)
  );
  $(".daily__computers--thismonth").text(
    Number(data.dailyAveragePerMonth.computersThisMonthAverage)
  );
  $(".monthly__lt--lastmonth").text(
    Number(data.wholeMonthsData.lastMonthSessionTime).toFixed(2)
  );
  $(".monthly__sessions--lastmonth").text(
    Number(data.wholeMonthsData.lastMonthSessionCount)
  );
  $(".monthly__users--lastmonth").text(
    Number(data.wholeMonthsData.usersLastMonth)
  );
  $(".monthly__computers--lastmonth").text(
    Number(data.wholeMonthsData.computersLastMonth)
  );
  $(".monthly__lt--thismonth").text(
    Number(data.wholeMonthsData.thisMonthSessionTime).toFixed(2)
  );
  $(".monthly__sessions--thismonth").text(
    Number(data.wholeMonthsData.thisMonthSessionCount)
  );
  $(".monthly__users--thismonth").text(
    Number(data.wholeMonthsData.usersThisMonth)
  );
  $(".monthly__computers--thismonth").text(
    Number(data.wholeMonthsData.computersThisMonth)
  );

  $(".perUserTime--lastmonth").text(
    Number(data.perUser.lastMonthSessionTimePerUser).toFixed(2)
  );
  $(".perUserTime--thismonth").text(
    Number(data.perUser.thisMonthSessionTimePerUser).toFixed(2)
  );
  $(".perUserCount--lastmonth").text(
    Number(data.perUser.lastMonthSessionCountPerUser)
  );
  $(".perUserCount--thismonth").text(
    Number(data.perUser.thisMonthSessionCountPerUser)
  );
}

$(document).ready(function() {
  addDataValues();
  generateImages();
});

/*
   <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="data.js"></script>
  <script src="dataApi.js"></script>

*/
