/* global postMessage, onmessage, fetch */
/* exported onmessage */
/* jshint -W020 */
/* jscs:disable maximumLineLength */
"use strict";

const CORS_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/";
const ITUNES_URL = "https://itunes.apple.com/search?";

var ITunes = {
  fetchJSON(url) {
    return fetch(`${CORS_ANYWHERE_URL}${url}`).then(function(response) {
      return response.json();
    }).then(function(data) {
      return data;
    });
  },

  fetchAlbums(pattern) {
    let url = `${CORS_ANYWHERE_URL}${ITUNES_URL}entity=albums&term=${pattern}`;
    return this.fetchJSON(url);
  },

  fetchArtists(pattern) {
    let url = `${CORS_ANYWHERE_URL}${ITUNES_URL}entity=allArtists&term=${pattern}`;
    return this.fetchJSON(url);
  }
};

onmessage = function(oEvent) {
  if (oEvent.data !== null && oEvent.data.command !== null) {
    switch (oEvent.data.command) {
      case "artists":
        ITunes.fetchArtists(oEvent.data.url).then(result => {
          postMessage({
            type: "artists",
            payload: result
          });
        }).catch(function(error) {
          postMessage({
            type: "artists-error",
            payload: error
          });
        });
        break;
      case "albums":
        ITunes.fetchAlbums(oEvent.data.url).then(result => {
          postMessage({
            type: "albums",
            payload: result
          });
        }).catch(function(error) {
          postMessage({
            type: "albums-error",
            payload: error
          });
        });
        break;
    }
  }
};
