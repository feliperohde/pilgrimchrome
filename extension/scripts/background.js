(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pilgrim = function () {
  function Pilgrim(options) {
    _classCallCheck(this, Pilgrim);

    console.log('Pilgrim module');

    var defaults = {

      // cookiesRequests: [
      //   {method: "getCookies", args: {url: 'http://pilgrim.itelios.net', name: 'Language'}},
      //   {method: "getCookies", args: {url: 'http://pilgrim.itelios.net', name: 'pilcook_prj'}},
      //   {method: "getCookies", args: {url: 'http://pilgrim.itelios.net', name: 'pilgrimAuthCookie'}},
      //   {method: "getCookies", args: {url: 'http://pilgrim.itelios.net', name: '.ASPXROLES'}}
      // ],

      cookies: [],
      isSyncedCookies: false,

      domain: 'http://pilgrim.itelios.net',

      // tasks: {},

      getGroupTaskUri: 'http://pilgrim.itelios.net/Task/getGroupTasks', /*
                                                                        post
                                                                        headers:
                                                                        query: ?prjId=3995797f-9a8a-4d36-8f01-079c6edb4f24
                                                                        {
                                                                        }
                                                                        */
      createTask: 'http://pilgrim.itelios.net/Task/Create/' /*
                                                            post
                                                            headers:
                                                            data:
                                                            {
                                                            ProjectID: '95e09e2b-a45b-4113-8d92-79abfb881441' // interno,
                                                            cbPrjModeID: 1,
                                                            IsChecked: 0,
                                                            TaskGroupID: 'c9ebb70c-2789-4ca6-9df9-1b6bd80dcc49' // tarefas nao faturadas
                                                            TimeSheetDate: 22/05/2017,
                                                            Name: 'nome da task',
                                                            taskStartDate: '23/05/2017 00:00:00',
                                                            taskEndDate: '24/05/2017 00:00:00',
                                                            PlannedWork: 20
                                                            } 
                                                            */

    };

    this.options = Object.assign({}, defaults, options);

    this._syncCookies(function (data) {
      this.options.isSyncedCookies = true;

      this._up();
    }.bind(this));

    //métodos expostos

    this.listem = this._listemEvents;
  }

  _createClass(Pilgrim, [{
    key: '_listemEvents',
    value: function _listemEvents() {

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        switch (request) {
          case 'syncTasks':

            this.postTasks(request.args.list);

            break;

          default:
            console.log('Invalid...');
        }
      });
    }
  }, {
    key: '_up',
    value: function _up() {
      console.log(this.options.cookies);

      console.log('pronto para sincronizar e fazer qqr coisa no pilgrim...');
    }
  }, {
    key: '_getCookie',
    value: function _getCookie(domain, name, callback) {
      chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
          callback(cookie.value);
        }
      });
    }
  }, {
    key: '_getAllCookies',
    value: function _getAllCookies(domain, callback) {
      chrome.cookies.getAll({ "url": domain }, function (allCookies) {
        if (callback) {
          callback(allCookies);
        }
      });
    }
  }, {
    key: '_syncCookies',
    value: function _syncCookies(callback) {

      this._getAllCookies(this.options.domain, function (data) {

        this.options.cookies = data;

        if (callback) {
          callback(data);
        }
      }.bind(this));
    }
  }, {
    key: '_postTask',


    //simula um post no pilgrim para cadastrar uma task inexistente
    value: function _postTask(task) {

      console.log(task);

      // $.ajax({
      //   type: "POST",
      //   url: url,
      //   data: data,
      //   success: success,
      //   error: error,
      //   dataType: dataType
      // });


      // function success () {

      // }

      // function error () {

      // }
    }
  }, {
    key: 'postTasks',


    //pega uma lista de tarefas e itera mandando para o metodo postTask
    value: function postTasks(tasks) {

      //tratar o erro aqui
      if (!tasks.length) return;

      for (var i = tasks.length - 1; i >= 0; i--) {
        postTask(tasks[i]);
      };
    }
  }]);

  return Pilgrim;
}();

exports.default = Pilgrim;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

var _pilgrim = require('../_modules/pilgrim/pilgrim');

var _pilgrim2 = _interopRequireDefault(_pilgrim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import css from '../_styles/css_map_all.json';

'use strict'; // Main javascript entry point
// Should handle bootstrapping/starting application

//import $ from 'jquery';


var pilgrim = new _pilgrim2.default();

pilgrim.listem();

},{"../_modules/pilgrim/pilgrim":1}]},{},[2])

//# sourceMappingURL=background.js.map
