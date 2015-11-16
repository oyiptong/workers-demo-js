/* global postMessage, onmessage */
/* exported onmessage */
/*jshint -W020 */

"use strict";

var numIters = 0;
var last = Date.now();

while (true) {
  var now = Date.now();
  var diff = now - last;
  if (diff > 1000) {
    postMessage({
      diffMS: diff,
      iters: numIters
    });
    numIters = 0;
    last = now;
  } else {
    numIters += 1;
  }
}
