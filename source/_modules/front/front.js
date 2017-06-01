export default class Front {
  constructor(options) {
    console.log('Front module');

    var defaults = {

      listElement: document.getElementById('task__list'),
      listItem: document.querySelector(".task__list .task__item"),

      watchDomain: 'itelios.atlassian.net/browse/',
      tasks: {}

    };

    this.options = Object.assign({}, defaults, options);

    this.up =  this._up;
    this.listemActions = this._listemActions;
    this.listemMessages = this._listemMessages;
    this.renderList = this._renderList;

    this.setRenderer = this._setRenderer;

  };

  _setRenderer (renderer) {
    console.log('//////////_setRenderer////////');

    this.options.renderer = renderer;

    return this;

  };

  _up () {

    console.log('/////////_up//////////');

      // envia-se para o background uma mensagem para ele subir a aplicação
      chrome.runtime.sendMessage({from: 'content/front', method: "up"});
      chrome.runtime.sendMessage({from: 'content/front', method: "getSavedTaskList"});

      if( window.location.href.indexOf(this.options.watchDomain) >= 0) {

        let task = {
          key: document.getElementsByClassName('issue-link')[0].getAttribute("data-issue-key"),
          title: document.getElementsByClassName('issue-link').textContent,
          excerpt: document.getElementById('summary-val').textContent,
          status: document.querySelector('#status-val > span').textContent,
          uri: window.location.href,
          synced: false
        };

        chrome.runtime.sendMessage({from: 'content/front', method: "addToList", args: {task: task}});
      };

    return this;

  };

  _renderList () {

    console.log('/////////_renderList//////////');

    //isso é feio, eu sei.
    let template =
    '<div id="pilgrim-itelios">' +
      '<div class="task">' +
        '<h2 class="task__title">Lista de tarefas capturadas</h2>' +

        '<%for(var index in this.data) {%>' +

          '<div class="day">' +
              '<h3 class="day__title"><% index %></h3>' +

              '<ul class="list--vertical task__list">' +
                '<%for(var task in this.data[index]) {%>' +
                    '<li class="list__item task__item">' +
                        '<a title="<% this.data[index][task].title %>" href="<% this.data[index][task].uri %>"><% this.data[index][task].key %></a>' +
                    '</li>' +
                '<%}%>' +
              '</ul>' +

          '</div>' +

        '<%}%>' +
      '</div>' +
    '</div>';

    let htmlToDOM = this.options.renderer.render(template, {data: this.options.tasks});

    document.body.innerHTML += htmlToDOM;

  };

  _toggleListVisibility () {
    console.log('///////////_toggleListVisibility/////////////');

    // var body = document.getElementsByTagName("body");
    // var list = document.getElementById("pilgrim-itelios");

    // if(list)
    //   body[0].removeChild(list);


    // this._renderList();

    let style = document.getElementById('pilgrim-itelios').style.display;

    if(style == 'none')
      document.getElementById('pilgrim-itelios').style.display = 'block';
    else
      document.getElementById('pilgrim-itelios').style.display = 'none';

  };

  _listemMessages () {

    console.log('/////////_listemMessages/////////');

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      switch(request.method) {
        case 'taskList':
          this.options.tasks = request.args.tasks;
          this._renderList();

          sendResponse({status: 'ok'});

        break;

        case 'toggleShow':
          this._toggleListVisibility();

          sendResponse({status: 'ok'});

        break;

        default:
          console.log('Invalid...');
      }

    }.bind(this));

    return this;

  };

  _listemActions () {
    console.log('/////////_listemActions//////////');

    document.addEventListener('DOMContentLoaded', function() {

      var elem = {
        syncBtn: document.getElementById('sync_task'),
        clearAllBtn: document.getElementById('clear_data')
      }

      //botao sincronizar com o pilgrim
      elem.syncBtn.addEventListener('click', function() {

        chrome.runtime.sendMessage({from: 'content/front', method: "syncTasks"});

      });

      //botao apagar toda a fila de tasks da memoria
      elem.clearAllBtn.addEventListener('click', function() {

        chrome.runtime.sendMessage({from: 'content/front', method: "clearAll"});

      });

    }.bind(this));

    return this;

  };

}