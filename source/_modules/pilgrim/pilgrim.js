export default class Pilgrim {
  constructor(options) {
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

    this.listem =  this._listemEvents;
    
  };

  _listemEvents () {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      switch(request) {
        case 'syncTasks':
          
          this.postTasks(request.args.list);

        break;


        default:
          console.log('Invalid...');
      }


    });

  };

  _up () {
    console.log(this.options.cookies);

    console.log('pronto para sincronizar e fazer qqr coisa no pilgrim...');
  };

  _getCookie (domain, name, callback) {
      chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
          if(callback) {
              callback(cookie.value);
          }
      });
  };

  _getAllCookies (domain, callback) {
      chrome.cookies.getAll({"url": domain}, function(allCookies) {
          if(callback) {
              callback(allCookies);
          }
      });
  };

  _syncCookies (callback) {

    this._getAllCookies(this.options.domain, function (data) {

      this.options.cookies = data;

      if(callback) {
        callback(data);
      }

    }.bind(this));   

  };

  //simula um post no pilgrim para cadastrar uma task inexistente
  _postTask (task) {

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

  };


  //pega uma lista de tarefas e itera mandando para o metodo postTask
  postTasks (tasks) {

    //tratar o erro aqui
    if(!tasks.length) return;

    for (var i = tasks.length - 1; i >= 0; i--) {
      postTask(tasks[i]);
    };

  };

}