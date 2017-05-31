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

      cookies: [],
      isSyncedCookies: false,

      domain: 'http://pilgrim.itelios.net',

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

    //métodos expostos
    this.listem = this._listemEvents;
    this.up = this._up;
  }

  _createClass(Pilgrim, [{
    key: '_up',
    value: function _up() {

      console.log('/////////_up//////////');

      this._syncCookies(function (data) {

        this.options.isSyncedCookies = true;
        console.log('pronto para sincronizar e fazer qqr coisa no pilgrim...');
      }.bind(this));
    }
  }, {
    key: '_listemEvents',
    value: function _listemEvents() {

      console.log('/////////_listemEvents//////////');

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        console.log(request);

        switch (request.method) {

          default:
            console.log('Invalid...');
        }
      }.bind(this));
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

      var myheaders = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': header_cookie
      };

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

      var myInit = {
        method: 'POST',
        headers: myheaders,
        mode: 'cors',
        body: JSON.stringify(body),
        cache: 'default',
        credentials: 'include'
      };

      // url (required), options (optional)
      fetch(this.options.createTask, myInit).then(function (response) {

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
  function Watcher(options) {
    _classCallCheck(this, Watcher);

    console.log('Watcher module');

    var defaults = {

      cookies: [],
      isSyncedCookies: false,

      domain: 'http://pilgrim.itelios.net',

      tasks: {},
      localStorageTasks: {}

    };

    this.options = Object.assign({}, defaults, options);

    //métodos expostos
    this.listem = this._listemEvents;
    this.up = this._up;
  }

  _createClass(Watcher, [{
    key: '_up',
    value: function _up() {

      console.log('/////////_up//////////');

      this._createDailyList();

      this._verifyLocalStorage();
    }
  }, {
    key: '_checkExists',
    value: function _checkExists(task) {

      console.log('here');

      console.log(this.options.currentDate);
      console.log(this.options.tasks);

      for (var i = this.options.tasks[this.options.currentDate].length - 1; i >= 0; i--) {

        if (this.options.tasks[this.options.currentDate][i].key === task.key) return true;
      }
    }
  }, {
    key: '_createDailyList',
    value: function _createDailyList() {

      console.log('////////////_createDailyList//////////');

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();

      var fullDate = day + '-' + month + '-' + year;

      this.options.currentDate = fullDate;

      //crio um idice para o dia no vetor de tasks se este nao existir
      if ("undefined" === typeof this.options.tasks[fullDate]) {
        this.options.tasks[fullDate] = [];
      }

      console.log(this.options.tasks);
      console.log(this.options.currentDate);
    }
  }, {
    key: '_addToList',
    value: function _addToList(task) {

      console.log('////////////_addToList//////////');
      console.log(this.options.tasks);

      if (!this._checkExists(task)) {
        this.options.tasks[this.options.currentDate].push(task);

        // Put the object into storage
        localStorage.setItem('tasks', JSON.stringify(this.options.tasks));
      }

      console.log(this.options.tasks);
    }
  }, {
    key: '_verifyLocalStorage',
    value: function _verifyLocalStorage() {

      console.log('verificando o localStorage');

      this.options.localStorageTasks = JSON.parse(localStorage.getItem('tasks'));

      if (this.options.localStorageTasks != null && this.options.localStorageTasks.length > 0) {
        this.options.tasks[this.options.currentDate] = this.options.localStorageTasks;
      } else {
        localStorage.setItem('tasks', JSON.stringify(this.options.tasks));
      }

      console.log(this.options.tasks);
    }
  }, {
    key: '_listemEvents',
    value: function _listemEvents() {

      console.log('/////////_listemEvents//////////');

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        console.log(request);

        switch (request.method) {
          case 'syncTasks':
            this._postTasks();
            break;

          case 'receiveTasks':
            this._receiveTasks(request.args.list);
            break;

          case 'addToList':
            this._addToList(request.args.task);
            break;

          case 'up':
            this._up();
            break;

          case 'clearAll':
            this._clearAllQueue();
            break;

          case 'getSavedTaskList':
            //devolvemos para o content uma mensagem com a lista de tarefas que estão em memória
            this._sendTaskToContent();
            break;

          default:
            console.log('Invalid...');
        }
      }.bind(this));
    }
  }, {
    key: '_clearAllQueue',
    value: function _clearAllQueue() {

      console.log('////////////_clearAllQueue//////////');

      this.options.tasks = [];
      this.options.localStorageTasks = this.options.tasks;

      localStorage.setItem('tasks', JSON.stringify(this.options.tasks));
    }
  }, {
    key: '_sendTaskToContent',
    value: function _sendTaskToContent() {

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        chrome.tabs.sendMessage(tabs[0].id, { method: "taskList", args: { tasks: this.options.tasks } }, function (response) {
          console.log(response);
        });
      }.bind(this));
    }
  }, {
    key: '_receiveTasks',
    value: function _receiveTasks(list) {

      if (!list.length) return;

      this.options.tasks = list;
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

var _watcher = require('../_modules/watcher/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _pilgrim = require('../_modules/pilgrim/pilgrim');

var _pilgrim2 = _interopRequireDefault(_pilgrim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

var pilgrim = new _pilgrim2.default();
var watcher = new _watcher2.default();

pilgrim.up();
watcher.listem();

},{"../_modules/pilgrim/pilgrim":1,"../_modules/watcher/watcher":2}]},{},[3])

//# sourceMappingURL=background.js.map
