// H264 test

onmessage = function(event) {
    self.unitTest = event.data; // { message, setting: { secondary, baseDir } }

    if (!self.console) { // polyfill WebWorkerConsole
        self.console = function() {};
        self.console.dir = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
        self.console.table = function() {};
    }

    importScripts("../../lib/WebModule.js");

    WebModule.verify  = __WEBMODULE_VERIFY__;
    WebModule.verbose = __WEBMODULE_VERBOSE__;
    WebModule.publish = __WEBMODULE_PUBLISH__;

    __MODULES__
    __WMTOOLS__
    __SOURCES__
    __OUTPUT__
    __TEST_CASE__

    self.postMessage(self.unitTest);
};

