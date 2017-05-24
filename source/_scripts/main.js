// Main javascript entry point
// Should handle bootstrapping/starting application

import $ from 'jquery';
//import Pilgrim from '../_modules/pilgrim/pilgrim';

'use strict';


var listBrowse = {};
var testBrowse = 'itelios.atlassian.net/browse/';

var savedTasks = JSON.parse(localStorage.getItem('tasks'));
var tasks = [];
var task;


if(savedTasks != null && savedTasks.length > 0 ){
  tasks = savedTasks;
} else {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

var checkExists = function (list, key) {

  if (list === null) return;

  for (var i = list.length - 1; i >= 0; i--) {

    if(list[i].key === key)
      return true
  }

};


document.addEventListener('DOMContentLoaded', function() {

  var elem = {
    syncBtn: document.getElementById('sync_task')
  }

  elem.syncBtn.addEventListener('click', function() {

    chrome.runtime.sendMessage({method: "syncTasks"});

  });


});


$(() => {

  if( window.location.href.indexOf(testBrowse) >= 0) {
    // Found world

    task = {
      key: $('.issue-link').attr('data-issue-key'),
      title: $('.issue-link').text(),
      excerpt: $('h1#summary-val').text()
    };

    if(!checkExists(savedTasks, task.key)) {
      tasks.push(task);

      // Put the object into storage
      localStorage.setItem('tasks', JSON.stringify(tasks));

      chrome.runtime.sendMessage({method: "receiveTasks", args: {list: tasks}});
    }
  }


});
