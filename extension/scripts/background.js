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

      tasks: {},

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

        console.log(request);

        switch (request.method) {
          case 'syncTasks':

            this._postTasks();

            break;

          case 'receiveTasks':

            this._receiveTasks(request.args.list);

          default:
            console.log('Invalid...');
        }
      }.bind(this));
    }
  }, {
    key: '_up',
    value: function _up() {
      console.log(this.options.cookies);

      console.log('pronto para sincronizar e fazer qqr coisa no pilgrim...');
    }
  }, {
    key: '_receiveTasks',
    value: function _receiveTasks(list) {

      if (!list.length) return;

      this.options.tasks = list;
    }
  }, {
    key: '_getCookie',
    value: function _getCookie(name) {
      for (var i = this.options.cookies.length - 1; i >= 0; i--) {

        if (this.options.cookies[i].name === name) return this.options.cookies[i];
      }
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

      var cookie_lang = this._getCookie('Language');
      var cookie_pilgrimAuthCookie = this._getCookie('pilgrimAuthCookie');
      var cookie_ASPXROLES = this._getCookie('.ASPXROLES');

      // let header_cookie = "Language=En; pilgrimAuthCookie=605E4E05C66E45307CB1DE8F875EA2ABA6633429838B6E0F19E9C9EAFF2DDBAF79BC7BF24EBDC4B38AD2ECADD91E6208A93FF5268FD976DB8CCF450CC59C96F148FE0746A610B681BB87F281601E1988B4703F2235096A403C61A4D1E24C245611F420735F6CDF303F6A02E4885435E446DEC5C3E782E84C3BD60BB7150A7FFDC783BB7C12833D41A5295E14BD5585A3; .ASPXROLES=_s0efXAmrBdhKQDLi0X-BuRzF8wK-i0dJ-FDGyCVuun6q06qjOZB2xfzsBbp2a5FWvd87BZnZxuoyTohRhB4W6zIOjND1-Xj1F_Xs25DbJMCXcL6-DIcJABNiAV2z0aR2tkmPnUd-k6Jx7RjfbosxHboUR0E1XLQjbAitxijG75jwsmbxjIzSXCwvHxJiPDAXrgPVaFFjpSfwXx88pNaDxaD_UMygiyI3EwBSrdzNnt1NcsRpCkTaqIMmrllBVReJ8qqKzSShd4frBVJ84btJMcKm1pb-XK-SppX-6T5ANxx62XFY4c1u1SbqDvCVH2eX2Di46KcIBR7wpHbkSppMGoHNHaOHTGNc0qQADXYnHvTipaRbvNCk2nCYbpOh0SlYgU0FBSyIYXVULRQ6z2vPx49dLdQEdoq2kAloZQa3HVxcbDY1qEfVzVEcoDJwfNxraouIpvdRi4TZDAz7WDHJKAtFm_ukYWqHevUo13chHzJ-mzG_XbmFP_Xqy_8-aMfkP_oEU5gxO1J47LLIrzDXut3C1kzn9f2VjDHxQZXLFnfyPbtrPlbAxaEQ7xBy1mME1ys3X8cPnqd4itcK5sWSulAz7zJrNStcsTFTjOgPh4fh6vnGvhpIdw5eW8rNMRIP2ASfljVrsvjlLYQ6Giza2nWETE6LQEusSKa_ScD0PJvbvLJTqgmMwC8uXm7L3951GYnDg03PA_n2Wl5rMjeRp1jtkN_rfgDyhbtFSqL_q_HfGcgJiM7lr8IjeEKre36WNQBloeUuWiAKmRrSXQ9dQVFZ-MWbdVtDmMXsrh5lbuXgxggcr9GbhgUxiBqjFIJ0"
      var header_cookie = "Language=" + cookie_lang.value + "; pilgrimAuthCookie=" + cookie_pilgrimAuthCookie.value + "; .ASPXROLES=" + cookie_ASPXROLES.value + "";

      // var myheaders = new Headers();

      var myheaders = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': header_cookie
      };

      console.log(myheaders);

      var body = {
        ProjectID: '95e09e2b-a45b-4113-8d92-79abfb881441', // interno,
        cbPrjModeID: 1,
        IsChecked: 0,
        TaskGroupID: 'c9ebb70c-2789-4ca6-9df9-1b6bd80dcc49', // tarefas nao faturadas
        TimeSheetDate: "22/05/2017",
        Name: task.excerpt,
        taskStartDate: '23/05/2017 00:00:00',
        taskEndDate: '24/05/2017 00:00:00',
        PlannedWork: 20
      };

      // url (required), options (optional)
      fetch(this.options.createTask, {

        method: 'POST',
        mode: 'cors',
        headers: new Headers(myheaders),
        body: JSON.stringify(body)

      }).then(function (response) {

        console.log(response);
      }).catch(function (err) {
        // Error :(
      });
    }
  }, {
    key: '_postTasks',


    //pega uma lista de tarefas e itera mandando para o metodo postTask
    value: function _postTasks() {

      for (var i = this.options.tasks.length - 1; i >= 0; i--) {
        this._postTask(this.options.tasks[i]);
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
