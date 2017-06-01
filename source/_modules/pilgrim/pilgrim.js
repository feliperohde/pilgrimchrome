export default class Pilgrim {
  constructor(options) {
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
    this.listem =  this._listemEvents;
    this.up =  this._up;

  };

  _up () {

    console.log('/////////_up//////////');

    this._syncCookies(function (data) {

      this.options.isSyncedCookies = true;
      console.log('pronto para sincronizar e fazer qqr coisa no pilgrim...');

    }.bind(this));

  };

  _listemEvents () {

    console.log('/////////_listemEvents//////////');

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      console.log(request);

      switch(request.method) {

        case 'syncTasks':
          this._postTasks();
        break;

        default:
          console.log('Invalid...');
      }


    }.bind(this));

  };

  _getCookie (name) {
      for (var i = this.options.cookies.length - 1; i >= 0; i--) {

        if(this.options.cookies[i].name === name)
          return this.options.cookies[i];
      }
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

    let cookie_lang =  this._getCookie('Language');
    let cookie_pilgrimAuthCookie = this._getCookie('pilgrimAuthCookie');
    let cookie_ASPXROLES = this._getCookie('.ASPXROLES');

    // let header_cookie = "Language=En; pilgrimAuthCookie=605E4E05C66E45307CB1DE8F875EA2ABA6633429838B6E0F19E9C9EAFF2DDBAF79BC7BF24EBDC4B38AD2ECADD91E6208A93FF5268FD976DB8CCF450CC59C96F148FE0746A610B681BB87F281601E1988B4703F2235096A403C61A4D1E24C245611F420735F6CDF303F6A02E4885435E446DEC5C3E782E84C3BD60BB7150A7FFDC783BB7C12833D41A5295E14BD5585A3; .ASPXROLES=_s0efXAmrBdhKQDLi0X-BuRzF8wK-i0dJ-FDGyCVuun6q06qjOZB2xfzsBbp2a5FWvd87BZnZxuoyTohRhB4W6zIOjND1-Xj1F_Xs25DbJMCXcL6-DIcJABNiAV2z0aR2tkmPnUd-k6Jx7RjfbosxHboUR0E1XLQjbAitxijG75jwsmbxjIzSXCwvHxJiPDAXrgPVaFFjpSfwXx88pNaDxaD_UMygiyI3EwBSrdzNnt1NcsRpCkTaqIMmrllBVReJ8qqKzSShd4frBVJ84btJMcKm1pb-XK-SppX-6T5ANxx62XFY4c1u1SbqDvCVH2eX2Di46KcIBR7wpHbkSppMGoHNHaOHTGNc0qQADXYnHvTipaRbvNCk2nCYbpOh0SlYgU0FBSyIYXVULRQ6z2vPx49dLdQEdoq2kAloZQa3HVxcbDY1qEfVzVEcoDJwfNxraouIpvdRi4TZDAz7WDHJKAtFm_ukYWqHevUo13chHzJ-mzG_XbmFP_Xqy_8-aMfkP_oEU5gxO1J47LLIrzDXut3C1kzn9f2VjDHxQZXLFnfyPbtrPlbAxaEQ7xBy1mME1ys3X8cPnqd4itcK5sWSulAz7zJrNStcsTFTjOgPh4fh6vnGvhpIdw5eW8rNMRIP2ASfljVrsvjlLYQ6Giza2nWETE6LQEusSKa_ScD0PJvbvLJTqgmMwC8uXm7L3951GYnDg03PA_n2Wl5rMjeRp1jtkN_rfgDyhbtFSqL_q_HfGcgJiM7lr8IjeEKre36WNQBloeUuWiAKmRrSXQ9dQVFZ-MWbdVtDmMXsrh5lbuXgxggcr9GbhgUxiBqjFIJ0"
    let header_cookie = "Language=" + cookie_lang.value + "; pilgrimAuthCookie=" + cookie_pilgrimAuthCookie.value + "; .ASPXROLES=" + cookie_ASPXROLES.value + ""

    let myheaders = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': header_cookie
    };

    let body = {
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

    let myInit = {
      method: 'POST',
      headers: myheaders,
      mode: 'cors',
      body: JSON.stringify(body),
      cache: 'default',
      credentials: 'include'
    };

    // url (required), options (optional)
    fetch(this.options.createTask, myInit).then(function(response) {

      console.log(response);

    }).catch(function(err) {
      // Error :(
    });

  };


  //pega uma lista de tarefas e itera mandando para o metodo postTask
  _postTasks () {

    for (var i = this.options.tasks.length - 1; i >= 0; i--) {
      this._postTask(this.options.tasks[i]);
    };

  };

}