// Main javascript entry point
// Should handle bootstrapping/starting application

import $ from 'jquery';

'use strict';

////////////////////////////

var watchDomain = 'itelios.atlassian.net/browse/';

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch(request.method) {
    case 'taskList':

      console.log(request.args.tasks);

      sendResponse({status: 'ok'});

    break;

    default:
      console.log('Invalid...');
  }

});


$(() => {

  // envia-se para o background uma mensagem para ele subir a aplicação
  chrome.runtime.sendMessage({method: "up"});

  if( window.location.href.indexOf(watchDomain) >= 0) {

    let task = {
      key: $('.issue-link').attr('data-issue-key'),
      title: $('.issue-link').text(),
      excerpt: $('h1#summary-val').text(),
      status: $('#status-val > span').text(),
      synced: false
    };

    chrome.runtime.sendMessage({method: "addToList", args: {task: task}});
  };


});
