import Front from '../_modules/front/front';
import Template from '../_utils/template/templateEngine';

'use strict';

let front = new Front();
////////////////////////////

front
  .setRenderer(new Template())
  .up()
  .listemMessages()
  .listemActions();