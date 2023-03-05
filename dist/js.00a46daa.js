// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/index.js":[function(require,module,exports) {
//Creating variables
var matrix = [];
var rows = 16;
var columns = 16;
var field = document.querySelector('.main');
var minesCount = 40;
var minesLocation = []; //array to store mines' id
//number of cells we should open to win
var boxesToCLick = rows * columns - minesCount;

//(I know, it's strange decision but I didn't find
//the way to delete my listener after click)
var gameStart = false; //to keep track of first click on the field

//to keep track of cliking after loosing/winning
var gameOver = false;
var seconds = 1;
var interval = null;
var smile = document.querySelector('.smile');
window.onload = function () {
  createWindow();
};
//functions to create main parts of the field: 
//smile, minesCounter and timer
//-----------------------------
function createSmile() {
  //adding listeners to smile-button
  smile.addEventListener('click', reset); //reseting game
  smile.addEventListener('mousedown', function (event) {
    if (event.button == 0) {
      smile.classList.toggle('smile-pressed');
    }
  }); //keydown
  smile.addEventListener('mouseup', function (event) {
    if (event.button == 0) {
      smile.classList.toggle('smile-pressed');
    }
  }); //keyup
}

function createCounter() {
  for (var i = 0; i < 3; i++) {
    var dig = document.createElement('div');
    dig.classList.add("dig");
    dig.classList.add('d0');
    dig.crossOrigin = 'anonymous';
    document.querySelector(".counter").append(dig);
  }
  document.querySelectorAll('.dig')[1].classList.add('d4');
  ;
}
function createTimer() {
  for (var i = 0; i < 3; i++) {
    var dig = document.createElement('div');
    dig.classList.add("num");
    dig.classList.add('d0');
    document.querySelector(".timer").append(dig);
  }
}
//-----------------------------

//counting flags
function counter(decrease) {
  var dozensPrev = Math.trunc(minesCount / 10);
  var unitsPrev = minesCount % 10;
  var digits = document.querySelectorAll('.dig');
  if (decrease) {
    minesCount--;
  } else {
    minesCount++;
  }
  //only 40 flags
  if (minesCount < 0) return;
  //getting pic from minesCount
  var dozens = Math.trunc(minesCount / 10);
  var units = minesCount % 10;
  digits[1].classList.replace('d' + dozensPrev, 'd' + dozens);
  digits[2].classList.replace('d' + unitsPrev, 'd' + units);
}

//functions to keep track of time
//-------------------------------
function startTimer() {
  if (interval) {
    return;
  }
  interval = setInterval(timer, 1000);
}
function stopTimer() {
  clearInterval(interval);
  interval = null;
}
function resetTimer() {
  stopTimer();
  seconds = 0;
  document.querySelectorAll('.num').forEach(function (block) {
    return block.src = '/img/digits/0.png';
  });
}
//-------------------------------

//convering time into pic
function getTime(number) {
  //don't play too log, it's only 16x16 field

  if (number > 999) {
    stopTimer;
    return;
  }
  var digits = document.querySelectorAll('.num');
  digits[0].src = '/img/digits/' + Math.trunc(number / 100) + '.png';
  digits[1].src = '/img/digits/' + Math.trunc(number / 10) % 10 + '.png';
  digits[2].src = '/img/digits/' + number % 10 + '.png';
}
//counting seconds
function timer() {
  getTime(seconds++);
}
//creating gaming window
function createWindow() {
  //adding timer, smile, counter
  createCounter();
  createTimer();
  createSmile();
  //making [][] to store cells(<div>) 
  //and adding them to the field
  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < columns; c++) {
      var box = document.createElement("div");
      box.classList.add('cell');
      box.id = r.toString() + ":" + c.toString();
      //one-time click listener
      box.addEventListener('click', function handler(event) {
        //checking if it's the first click
        if (gameStart) {
          return;
        } else {
          gameStart = true;
          startGame(event.target);
        }
      });
      document.querySelector(".matrix").append(box);
      row.push(box);
    }
    matrix.push(row);
  }
}

//starting the game after a click
function startGame(el) {
  startTimer();
  setMines(el.id);
  //adding listeners
  document.querySelectorAll('.cell').forEach(function (box) {
    //regular clicks
    box.addEventListener("click", leftClick);
    box.addEventListener("contextmenu", rightClick);
    //pressing leftClick and changing smile's face
    box.addEventListener('mousedown', function (event) {
      if (event.button == 0 && !gameOver) {
        smile.classList.toggle('smile-shocked');
      }
    });
    box.addEventListener('mouseup', function (event) {
      if (event.button == 0 && !gameOver) {
        smile.classList.toggle('smile-shocked');
      }
    });
  });
  //making a click to open the fist cell
  el.click();
}

//setting mines on the field
function setMines(firstClick) {
  var minesLeft = minesCount;
  while (minesLeft > 0) {
    var r = Math.floor(Math.random() * rows);
    var c = Math.floor(Math.random() * columns);
    var id = r.toString() + ":" + c.toString();
    //our fist-clicked cell can't be a mine
    if (!minesLocation.includes(id) && id !== firstClick) {
      minesLocation.push(id);
      minesLeft -= 1;
    }
  }
}

//listening to the left click
function leftClick() {
  //we can't open cell if it's flagged/questioned or opened
  if (gameOver || this.classList.contains('tile-clicked') || this.classList.contains('flagged') || this.classList.contains('questioned')) {
    return;
  }
  var box = this;
  //if our box contains mine - we lose the game
  if (minesLocation.includes(box.id)) {
    box.classList.add('bomb-pressed');
    ;
    gameOver = true;
    showMines(box);
    return;
  }
  //we should check near cells to open them or not
  var coordinates = box.id.split(":");
  var r = parseInt(coordinates[0]);
  var c = parseInt(coordinates[1]);
  checkMine(r, c);
}

//listening to the right click
function rightClick(event) {
  event.preventDefault();
  //we can't click after we winned or lost
  if (gameOver || this.classList.contains('tile-clicked')) {
    return;
  }
  //changing flag/question/closed
  var boxVisual = this.classList;
  if (boxVisual.contains('flagged')) {
    boxVisual.remove('flagged');
    boxVisual.add('questioned');
    counter(false);
  } else if (boxVisual.contains('questioned')) {
    boxVisual.remove('questioned');
  } else {
    boxVisual.add('flagged');
    counter(true);
  }
}
function isMine(r, c) {
  if (minesLocation.includes(r + ":" + c)) {
    return 1;
  }
  return 0;
}
function checkMine(r, c) {
  //in case current cell was opened or doesn't exist
  if (r < 0 || r >= rows || c < 0 || c >= columns || matrix[r][c].classList.contains("tile-clicked")) {
    return;
  }
  matrix[r][c].classList.add("tile-clicked");
  boxesToCLick--;
  var minesFound = 0;
  minesFound += isMine(r - 1, c - 1); //top left
  minesFound += isMine(r - 1, c); //top 
  minesFound += isMine(r - 1, c + 1); //top right
  minesFound += isMine(r, c - 1); //left
  minesFound += isMine(r, c + 1); //right
  minesFound += isMine(r + 1, c - 1); //bottom left
  minesFound += isMine(r + 1, c); //bottom 
  minesFound += isMine(r + 1, c + 1); //bottom right
  //opening not empty field
  if (minesFound > 0) {
    matrix[r][c].innerText = '';
    matrix[r][c].classList.add("x" + minesFound.toString());
  }
  //opening empty field
  else {
    checkMine(r - 1, c - 1); //top left
    checkMine(r - 1, c); //top
    checkMine(r - 1, c + 1); //top 
    checkMine(r, c - 1); //left
    checkMine(r, c + 1); //right
    checkMine(r + 1, c - 1); //bottom left
    checkMine(r + 1, c); //bottom
    checkMine(r + 1, c + 1); //bottom right
  }
  //checking the win
  if (boxesToCLick == 0) {
    stopTimer();
    document.querySelectorAll(".dig").forEach(function (dig) {
      return dig.src = '/img/digits/0.png';
    });
    gameOver = true;
    smile.classList.add('smile-cool');
  }
}

//if we failed:
function showMines(pressed) {
  stopTimer();
  smile.classList.add('smile-sad');
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < columns; c++) {
      var box = matrix[r][c];
      if (pressed == box) continue;
      if (box.classList.contains('questioned')) {
        continue;
      } else if (box.classList.contains('flagged')) {
        if (!minesLocation.includes(box.id)) {
          box.classList.add('not-a-bomb');
        }
        continue;
      } else if (minesLocation.includes(box.id)) {
        box.classList.add('bomb');
      }
    }
  }
}
function reset() {
  //renewing vars
  matrix = [];
  minesCount = 40;
  minesLocation = [];
  boxesToCLick = rows * columns - minesCount;
  seconds = 1;
  gameStart = false;
  gameOver = false;
  //cleaning the field
  document.querySelector(".matrix").innerHTML = '';
  document.querySelector(".counter").innerHTML = '';
  document.querySelector(".timer").innerHTML = '';
  smile.classList.toggle('smile-sad', false);
  smile.classList.toggle('smile-cool', false);
  resetTimer();
  createWindow();
}
},{}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55541" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map