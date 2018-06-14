'use strict';
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

function findItemIdxById(items, id) {
  return items.findIndex(function(item) {
    return item.id === id;
  });
}
function makeId() {
  var length = 6;
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}
