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

      listElement: document.getElementById('task__list'),
      listItem: document.querySelector(".task__list .task__item"),

      watchDomain: 'itelios.atlassian.net/browse/',
      tasks: {}

    };

    this.options = Object.assign({}, defaults, options);

    this.up = this._up;
    this.listemActions = this._listemActions;
    this.listemMessages = this._listemMessages;
    this.renderList = this._renderList;

    this.setRenderer = this._setRenderer;
  }

  _createClass(Front, [{
    key: '_setRenderer',
    value: function _setRenderer(renderer) {
      console.log('//////////_setRenderer////////');

      this.options.renderer = renderer;

      return this;
    }
  }, {
    key: '_up',
    value: function _up() {

      console.log('/////////_up//////////');

      // envia-se para o background uma mensagem para ele subir a aplicação
      chrome.runtime.sendMessage({ from: 'content/front', method: "up" });
      chrome.runtime.sendMessage({ from: 'content/front', method: "getSavedTaskList" });

      if (window.location.href.indexOf(this.options.watchDomain) >= 0) {

        var task = {
          key: document.getElementsByClassName('issue-link')[0].getAttribute("data-issue-key"),
          title: document.getElementsByClassName('issue-link').textContent,
          excerpt: document.getElementById('summary-val').textContent,
          status: document.querySelector('#status-val > span').textContent,
          uri: window.location.href,
          synced: false
        };

        chrome.runtime.sendMessage({ from: 'content/front', method: "addToList", args: { task: task } });
      };

      return this;
    }
  }, {
    key: '_renderList',
    value: function _renderList() {

      console.log('/////////_renderList//////////');

      //isso é feio, eu sei.
      var template = '<div id="pilgrim-itelios">' + '<div class="task">' + '<h2 class="task__title">Lista de tarefas capturadas</h2>' + '<%for(var index in this.data) {%>' + '<div class="day">' + '<h3 class="day__title"><% index %></h3>' + '<ul class="list--vertical task__list">' + '<%for(var task in this.data[index]) {%>' + '<li class="list__item task__item">' + '<a target="_blank" title="<% this.data[index][task].title %>" href="<% this.data[index][task].uri %>"><% this.data[index][task].key %></a>' + '</li>' + '<%}%>' + '</ul>' + '</div>' + '<%}%>' + '</div>' + '</div>';

      var htmlToDOM = this.options.renderer.render(template, { data: this.options.tasks });

      document.body.innerHTML += htmlToDOM;
    }
  }, {
    key: '_toggleListVisibility',
    value: function _toggleListVisibility() {
      console.log('///////////_toggleListVisibility/////////////');

      // var body = document.getElementsByTagName("body");
      // var list = document.getElementById("pilgrim-itelios");

      // if(list)
      //   body[0].removeChild(list);


      // this._renderList();

      var style = document.getElementById('pilgrim-itelios').style.display;

      if (style == 'none') document.getElementById('pilgrim-itelios').style.display = 'block';else document.getElementById('pilgrim-itelios').style.display = 'none';
    }
  }, {
    key: '_listemMessages',
    value: function _listemMessages() {

      console.log('/////////_listemMessages/////////');

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.method) {
          case 'taskList':
            this.options.tasks = request.args.tasks;
            this._renderList();

            sendResponse({ status: 'ok' });

            break;

          case 'toggleShow':
            this._toggleListVisibility();

            sendResponse({ status: 'ok' });

            break;

          default:
            console.log('Invalid...');
        }
      }.bind(this));

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

          chrome.runtime.sendMessage({ from: 'content/front', method: "syncTasks" });
        });

        //botao apagar toda a fila de tasks da memoria
        elem.clearAllBtn.addEventListener('click', function () {

          chrome.runtime.sendMessage({ from: 'content/front', method: "clearAll" });
        });
      }.bind(this));

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

var _templateEngine = require('../_utils/template/templateEngine');

var _templateEngine2 = _interopRequireDefault(_templateEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var front = new _front2.default();
////////////////////////////

front.setRenderer(new _templateEngine2.default()).up().listemMessages().listemActions();

},{"../_modules/front/front":1,"../_utils/template/templateEngine":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = function () {
  function Template() {
    _classCallCheck(this, Template);

    this.name = 'Template';
    console.log('Template module');

    this.render = this._render;
  }

  _createClass(Template, [{
    key: '_render',
    value: function _render(html, options) {
      var html = html;
      var re = /<%([^%>]+)?%>/g,
          reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
          code = 'var r=[];\n',
          cursor = 0,
          match;
      var add = function add(line, js) {
        js ? code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n' : code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
        return add;
      };
      while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
      };
      add(html.substr(cursor, html.length - cursor));
      code += 'return r.join("");';

      return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }
  }]);

  return Template;
}();

exports.default = Template;
module.exports = exports['default'];

},{}]},{},[2])

//# sourceMappingURL=main.js.map
