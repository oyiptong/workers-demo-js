/* globals TimeSeries, SmoothieChart */
"use strict";

(function() {
  document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.querySelector("#cpu-chart");

    // setup chart
    var cpu = new TimeSeries();
    var chart = new SmoothieChart({labels: {fontSize: 16}, minValue: 0});
    chart.addTimeSeries(cpu, {
      strokeStyle: "rgba(0, 255, 0, 1)",
      fillStyle: "rgba(0, 255, 0, 0.5)",
      lineWidth: 1});
    chart.streamTo(canvas, 500);

    var last = Date.now();
    var delay = 100;

    // update every 100 ms
    setInterval(function() {
      var now = Date.now();
      var diff = now - last - delay;
      cpu.append(new Date().getTime(), diff);
      last = now;
    }, delay);

    var worker = new Worker("./js/busyWorker.js");
    worker.onmessage = function(e) {
      console.log(e.data);
    }

    /*
    // example of how to create a worker
    var worker = new Worker("./js/itunesWorker.js");
    worker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
    }, false);

    // example of how to communicate with a worker
    worker.postMessage({
      command: "scrape",
      url: "https://itunes.apple.com/search?term=offspring&entity=album"
    });
    */
  });
})(window);
