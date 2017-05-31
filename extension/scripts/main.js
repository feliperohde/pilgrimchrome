(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Front = function () {
  function Front(options) {
    _classCallCheck(this, Front);

    console.log('Front module');

    var defaults = {

      watchDomain: 'itelios.atlassian.net/browse/',
      tasks: {}

    };

    this.options = Object.assign({}, defaults, options);

    this.up = this._up;
    this.listemActions = this._listemActions;
    this.listemMessages = this._listemMessages;
  }

  _createClass(Front, [{
    key: '_up',
    value: function _up() {

      console.log('/////////_up//////////');

      document.addEventListener('DOMContentLoaded', function () {

        // envia-se para o background uma mensagem para ele subir a aplicação
        chrome.runtime.sendMessage({ method: "up" });
        chrome.runtime.sendMessage({ method: "getSavedTaskList" });

        if (window.location.href.indexOf(this.options.watchDomain) >= 0) {

          var task = {
            key: document.getElementsByClassName('issue-link')[0].getAttribute("data-issue-key"),
            title: document.getElementsByClassName('issue-link').textContent,
            excerpt: document.getElementById('summary-val').textContent,
            status: document.querySelector('#status-val > span').textContent,
            uri: window.location.href,
            synced: false
          };

          chrome.runtime.sendMessage({ method: "addToList", args: { task: task } });
        };
      }.bind(this));

      return this;
    }
  }, {
    key: '_listemMessages',
    value: function _listemMessages() {

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.method) {
          case 'taskList':

            console.log(request.args.tasks);
            tasks = sendResponse({ status: 'ok' });

            break;

          default:
            console.log('Invalid...');
        }
      });

      return this;
    }
  }, {
    key: '_listemActions',
    value: function _listemActions() {
      console.log('/////////_listemActions//////////');

      document.addEventListener('DOMContentLoaded', function () {

        var elem = {
          syncBtn: document.getElementById('sync_task'),
          clearAllBtn: document.getElementById('clear_data')
        };

        //botao sincronizar com o pilgrim
        elem.syncBtn.addEventListener('click', function () {

          chrome.runtime.sendMessage({ method: "syncTasks" });
        });

        //botao apagar toda a fila de tasks da memoria
        elem.clearAllBtn.addEventListener('click', function () {

          chrome.runtime.sendMessage({ method: "clearAll" });
        });
      });

      return this;
    }
  }]);

  return Front;
}();

exports.default = Front;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

var _front = require('../_modules/front/front');

var _front2 = _interopRequireDefault(_front);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var front = new _front2.default();
////////////////////////////

front.up().listemMessages().listemActions();

},{"../_modules/front/front":1}]},{},[2])

//# sourceMappingURL=main.js.map
