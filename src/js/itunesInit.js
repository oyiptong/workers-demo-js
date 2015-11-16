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

    var itunesworker = new Worker("./js/itunesWorker.js");
    itunesworker.onmessage = function(e) {
      var resdiv = document.getElementById("results");
      var restable = "";

      switch(e.data.type) {
        case 'artists':
          restable = "<table>"
          console.log("Found " + e.data.type);
          var result = e.data.payload;

          result.results.forEach(function(element, index, array) {
            restable = restable + "<tr>";
            restable = restable + "<td>" + (index + 1) + "</td>";
            restable = restable + "<td>" + element.artistName + "</td>";
            restable = restable + "</tr>";
          });
          restable = restable + "</table>"
          break;
        case 'albums':
          restable = "<table>"
          console.log("Found " + e.data.type);
          var result = e.data.payload;

          result.results.forEach(function(element, index, array) {
            restable = restable + "<tr>";
            restable = restable + "<td>" + (index + 1) + "</td>";
            restable = restable + "<td>" + element.artistName + "</td>";
            restable = restable + "<td>" + element.collectionName + "</td>";
            restable = restable + "</tr>";
          });
          restable = restable + "</table>"
          break;
        case 'artists-error':
        case 'albums-error':
          console.log("Error fetching " + e.data.type);
          break;
        default:
          console.log("Unknown response from worker:");
          console.log(e.data);
      }

      resdiv.innerHTML = restable;
    }

    var submitbutton = document.getElementById('submitSearch');
    submitbutton.onclick = function(e) {
      var stbox = document.getElementById('inputSearchTerm');

      var command = document.getElementById('radioAlbums').checked ? 'albums' : 'artists';
      var term = stbox = document.getElementById('inputSearchTerm').value;

      itunesworker.postMessage({
        command: command,
        url: encodeURIComponent(term)
      });

      console.log('Posted to worker: ' + command + ' ' + term)
    };

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


window.submit = function lala(e) {
  e.preventDefault();

  document.getElementById('submitSearch').click();
}
