// Main javascript entry point
// Should handle bootstrapping/starting application

import Watcher from '../_modules/watcher/watcher';
import Pilgrim from '../_modules/pilgrim/pilgrim';

'use strict';

var pilgrim = new Pilgrim();
var watcher = new Watcher();

pilgrim.up();
watcher.listem();