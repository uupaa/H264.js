// http://git.io/WebModule

// --- global variables ------------------------------------
// https://github.com/uupaa/WebModule/wiki/WebModuleIdiom
var GLOBAL = (this || 0).self || global;

// --- environment detection -------------------------------
// https://github.com/uupaa/WebModule/wiki/EnvironmentDetection
(function() {

var hasGlobal   = !!GLOBAL.global;
var processType = !!(GLOBAL.process || 0).type;
var nativeTimer = !!/native/.test(setTimeout);

GLOBAL.IN_BROWSER = !hasGlobal && "document" in GLOBAL;
GLOBAL.IN_WORKER  = !hasGlobal && "WorkerLocation" in GLOBAL;
GLOBAL.IN_NODE    =  hasGlobal && !processType && !nativeTimer;
GLOBAL.IN_NW      =  hasGlobal && !processType &&  nativeTimer;
GLOBAL.IN_EL      =  hasGlobal &&  processType;

})();

// --- validate and assert functions -----------------------
//{@dev https://github.com/uupaa/WebModule/wiki/Validate
GLOBAL.$type  = function(v, types)   { return GLOBAL.Valid ? GLOBAL.Valid.type(v, types)  : true; };
GLOBAL.$keys  = function(o, keys)    { return GLOBAL.Valid ? GLOBAL.Valid.keys(o, keys)   : true; };
GLOBAL.$some  = function(v, cd, ig)  { return GLOBAL.Valid ? GLOBAL.Valid.some(v, cd, ig) : true; };
GLOBAL.$args  = function(api, args)  { return GLOBAL.Valid ? GLOBAL.Valid.args(api, args) : true; };
GLOBAL.$valid = function(v, api, hl) { return GLOBAL.Valid ? GLOBAL.Valid(v, api, hl)     : true; };
GLOBAL.$values = function(o, vals)   { return GLOBAL.Valid ? GLOBAL.Valid.values(o, vals) : true; };
//}@dev

// --- WebModule -------------------------------------------
GLOBAL.WebModule = {
    verify:  false, // Verify mode
    verbose: false, // Verbose mode
    publish: false, // WebModule based modules publish to global.
    closure: {},    // module script stocker
    exports: function(moduleName, moduleClosure) {
        var wm = this; // GLOBAL.WebModule

        // https://github.com/uupaa/WebModule/wiki/SwitchModulePattern
        var alias = wm[moduleName] ? (moduleName + "_") : moduleName;

        if (!wm[alias]) { // secondary module already exported -> skip
            wm[alias] = moduleClosure(GLOBAL); // evaluate the module entity
            wm.closure[alias] = moduleClosure + ""; // stock

            if (wm.publish && !GLOBAL[alias]) {
                GLOBAL[alias] = wm[alias]; // publish to global
            }
        }
        return wm[alias];
    }
};

