/*jslint white: true */
/*global module, String, require, console */

/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/roku.js
 */

State = {};

exports.rokuControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var rokuController = require(__dirname + '/../../../controllers/roku'),
        commandRequest = rokuController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      command    : 'TEST' }),
        letterRequest  = rokuController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      letter     : 'T' }),
        listRequest    = rokuController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      list       : true }),
        launchRequest  = rokuController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      launch     : 'TEST' });

    test.deepEqual(commandRequest, { host   : '123.456.789.101',
                                     port   : '80',
                                     path   : '/keypress/TEST',
                                     method : 'POST' }, 'Roku command validation');
    test.deepEqual(letterRequest, { host   : '123.456.789.101',
                                    port   : '80',
                                    path   : '/keypress/Lit_T',
                                    method : 'POST' }, 'Roku letter validation');
    test.deepEqual(listRequest, { host   : '123.456.789.101',
                                  port   : '80',
                                  path   : '/query/apps',
                                  method : 'GET' }, 'Roku list validation');
    test.deepEqual(launchRequest, { host   : '123.456.789.101',
                                    port   : '80',
                                    path   : '/launch/11?contentID=TEST',
                                    method : 'POST' }, 'Roku list validation');

    test.done();
  },

  onload : function (test) {
    'use strict';

    State.FOO       = {};
    State.FOO.value = [{ id : 'ID1', cache : 'CACHE1', name : 'NAME1' },
                       { id : 'ID2', cache : 'CACHE2', name : 'NAME2' }];

    var rokuController = require(__dirname + '/../../../controllers/roku'),
        onloadMarkup   = rokuController.onload({ markup : '<h1>Contents:</h1> {{ROKU_DYNAMIC}}',
                                                 config : { deviceId : 'FOO' } });

    test.ok((onloadMarkup.indexOf('<h1>Contents:</h1>') !== -1), 'Passed markup validated');
    test.ok((onloadMarkup.indexOf('<li><a href="/?{{DEVICE_ID}}=launch-ID1"><img {{LAZY_LOAD_IMAGE}}="CACHE1" alt="NAME1" title="NAME1" /></a></li>') !== -1), 'First app validated');
    test.ok((onloadMarkup.indexOf('<li><a href="/?{{DEVICE_ID}}=launch-ID2"><img {{LAZY_LOAD_IMAGE}}="CACHE2" alt="NAME2" title="NAME2" /></a></li>') !== -1), 'Second app validated');

    test.done();
  }
};