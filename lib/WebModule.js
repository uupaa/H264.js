// http://git.io/WebModule

// --- global variables ------------------------------------
// https://github.com/uupaa/WebModule/wiki/WebModuleIdiom
var GLOBAL = (this || 0).self || global;

// --- environment detection -------------------------------
// https://github.com/uupaa/WebModule/wiki/EnvironmentDetection
(function() {

var hasGlobal     = !!GLOBAL.global;              // Node.js, NW.js, Electron
var processType   = !!(GLOBAL.process || 0).type; // Electron(render and main)
var nativeTimer   = !!/native/.test(setTimeout);  // Node.js, Electron(main)

GLOBAL.IN_BROWSER = !hasGlobal && "document"       in GLOBAL;   // Browser and Worker
GLOBAL.IN_WORKER  = !hasGlobal && "WorkerLocation" in GLOBAL;   // Worker
GLOBAL.IN_NODE    =  hasGlobal && !processType && !nativeTimer; // Node.js
GLOBAL.IN_NW      =  hasGlobal && !processType &&  nativeTimer; // NW.js
GLOBAL.IN_EL      =  hasGlobal &&  processType;                 // Electron(render and main)

})();

// --- validation and assertion functions ------------------
//{@dev https://github.com/uupaa/WebModule/wiki/Validate
GLOBAL.$type   = function(v, types)   { return GLOBAL.Valid ? GLOBAL.Valid.type(v, types)  : true; };
GLOBAL.$keys   = function(o, keys)    { return GLOBAL.Valid ? GLOBAL.Valid.keys(o, keys)   : true; };
GLOBAL.$some   = function(v, cd, ig)  { return GLOBAL.Valid ? GLOBAL.Valid.some(v, cd, ig) : true; };
GLOBAL.$args   = function(api, args)  { return GLOBAL.Valid ? GLOBAL.Valid.args(api, args) : true; };
GLOBAL.$valid  = function(v, api, hl) { return GLOBAL.Valid ? GLOBAL.Valid(v, api, hl)     : true; };
GLOBAL.$values = function(o, vals)    { return GLOBAL.Valid ? GLOBAL.Valid.values(o, vals) : true; };
//}@dev

// --- WebModule -------------------------------------------
GLOBAL.WebModule = {
    CODE:    {},    // source code container.
    VERIFY:  false, // verify mode flag.
    VERBOSE: false, // verbose mode flag.
    PUBLISH: false, // publish flag, module publish to global namespace.
    exports: function(moduleName,      // @arg ModuleNameString
                      moduleClosure) { // @arg JavaScriptCodeString
                                       // @ret ModuleObject
        var wm = this; // GLOBAL.WebModule

        // https://github.com/uupaa/WebModule/wiki/SwitchModulePattern
        var alias = wm[moduleName] ? (moduleName + "_") : moduleName;

        if (!wm[alias]) { // secondary module already exported -> skip
            wm[alias] = moduleClosure(GLOBAL, wm, wm.VERIFY, wm.VERBOSE); // evaluate the module entity.
            wm.CODE[alias] = moduleClosure + ""; // store to the container.

            if (wm.PUBLISH && !GLOBAL[alias]) {
                GLOBAL[alias] = wm[alias]; // module publish to global namespace.
            }
        }
        return wm[alias];
    }
};

