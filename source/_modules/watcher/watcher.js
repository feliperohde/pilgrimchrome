export default class Watcher {
  constructor(options) {
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
    this.listem =  this._listemEvents;
    this.up =  this._up;

  };

  _up () {

    console.log('/////////_up//////////');

    this._createDailyList();

    this._verifyLocalStorage();

  };

  _checkExists (task) {

    console.log('here');

    console.log(this.options.currentDate);
    console.log(this.options.tasks);

    for (var i = this.options.tasks[this.options.currentDate].length - 1; i >= 0; i--) {

      if(this.options.tasks[this.options.currentDate][i].key === task.key)
        return true

    }

  };

  _createDailyList () {

    console.log('////////////_createDailyList//////////');

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let fullDate = day + '-' + month + '-'  + year;

    this.options.currentDate = fullDate;

    //crio um idice para o dia no vetor de tasks se este nao existir
    if("undefined" === typeof this.options.tasks[fullDate]) {
      this.options.tasks[fullDate] = [];
    }

    console.log(this.options.tasks);
    console.log(this.options.currentDate);

  };

  _addToList (task) {

    console.log('////////////_addToList//////////');
    console.log(this.options.tasks);

    if(!this._checkExists(task)) {
      this.options.tasks[this.options.currentDate].push(task);

      // Put the object into storage
      localStorage.setItem('tasks', JSON.stringify(this.options.tasks));
    }

    console.log(this.options.tasks);

  };

  _verifyLocalStorage () {

    console.log('verificando o localStorage');

    this.options.localStorageTasks = JSON.parse(localStorage.getItem('tasks'));

    if(this.options.localStorageTasks != null && this.options.localStorageTasks.length > 0 ){
      this.options.tasks[this.options.currentDate] = this.options.localStorageTasks;
    } else {
      localStorage.setItem('tasks', JSON.stringify(this.options.tasks));
    }

    console.log(this.options.tasks);

  };

  _listemEvents () {

    console.log('/////////_listemEvents//////////');

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      console.log(request);

      switch(request.method) {
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

  };


  _clearAllQueue () {

    console.log('////////////_clearAllQueue//////////');

    this.options.tasks = [];
    this.options.localStorageTasks = this.options.tasks;

    localStorage.setItem('tasks', JSON.stringify(this.options.tasks));

  };

  _sendTaskToContent () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      chrome.tabs.sendMessage(tabs[0].id, {method: "taskList", args: {tasks: this.options.tasks}}, function(response) {
        console.log(response);
      });

    }.bind(this));

  };

  _receiveTasks (list) {

    if(!list.length) return;

    this.options.tasks = list;

  };

}