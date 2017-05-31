export default class Front {
  constructor(options) {
    console.log('Front module');

    var defaults = {

      watchDomain: 'itelios.atlassian.net/browse/',
      tasks: {}

    };

    this.options = Object.assign({}, defaults, options);

    this.up =  this._up;
    this.listemActions = this._listemActions;
    this.listemMessages = this._listemMessages;

  };

  _up () {

    console.log('/////////_up//////////');

    document.addEventListener('DOMContentLoaded', function() {

      // envia-se para o background uma mensagem para ele subir a aplicação
      chrome.runtime.sendMessage({method: "up"});
      chrome.runtime.sendMessage({method: "getSavedTaskList"});

      if( window.location.href.indexOf(this.options.watchDomain) >= 0) {

        let task = {
          key: document.getElementsByClassName('issue-link')[0].getAttribute("data-issue-key"),
          title: document.getElementsByClassName('issue-link').textContent,
          excerpt: document.getElementById('summary-val').textContent,
          status: document.querySelector('#status-val > span').textContent,
          uri: window.location.href,
          synced: false
        };

        chrome.runtime.sendMessage({method: "addToList", args: {task: task}});
      };

    }.bind(this));

    return this;

  };

  _listemMessages () {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      switch(request.method) {
        case 'taskList':

          console.log(request.args.tasks);
          tasks =

          sendResponse({status: 'ok'});

        break;

        default:
          console.log('Invalid...');
      }

    });

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

        chrome.runtime.sendMessage({method: "syncTasks"});

      });


      //botao apagar toda a fila de tasks da memoria
      elem.clearAllBtn.addEventListener('click', function() {

        chrome.runtime.sendMessage({method: "clearAll"});

      });

    });

    return this;

  };

}