// Main javascript entry point
// Should handle bootstrapping/starting application

import $ from 'jquery';
//import Pilgrim from '../_modules/pilgrim/pilgrim';
// import css from '../_styles/css_map_all.json';

'use strict';

var listBrowse = {};
var testBrowse = 'itelios.atlassian.net/browse/';

var savedTasks = JSON.parse(localStorage.getItem('tasks'));
var tasks = [];
var task;

if(savedTasks.length === 0 ){
  localStorage.setItem('tasks', JSON.stringify(tasks));  
} else {
  tasks =  savedTasks;
}

var checkExists = function (list, key) {

  if (list === null) return;

  for (var i = list.length - 1; i >= 0; i--) {

    if(list[i].key === key)
      return true
  }

};





console.log(chrome);


document.addEventListener('DOMContentLoaded', function() {

  var elem = {
    syncBtn: document.getElementById('sync_task')
  }


  elem.syncBtn.addEventListener('click', function() {

    console.log('clicou em sincar.');

    chrome.runtime.sendMessage({method: "syncTasks", args: {list: tasks}});

  });



  //coisas para minerar as tarefas do jira
  // if( window.location.href.indexOf(testBrowse) >= 0) {
  //   // Found world

  //   task = {
  //     key: $('.issue-link').attr('data-issue-key'),
  //     title: $('.issue-link').text(),
  //     excerpt: $('h1#summary-val').text()
  //   };

  //   if(!checkExists(savedTasks, task.key)) {
  //     tasks.push(task);

  //     // Put the object into storage
  //     localStorage.setItem('tasks', JSON.stringify(tasks));      
  //   }
  // }


  console.log('js is added and working...');

});


// $(() => {

//   var elem = {
//     syncBtn: $('#sync_task')
//   }


//   console.log(document);

//   //eventos
//   ////////////

//   elem.syncBtn.on('click', function (evt) {
//     evt.preventDefault();


//     console.log('clicou em sincar.');
    
//     chrome.runtime.sendMessage({method: "syncTasks", args: {list: tasks}});
    

//   });

  
// });
