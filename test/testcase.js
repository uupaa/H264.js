var ModuleTestH264 = (function(global) {

var test = new Test(["H264"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testH264RawStream,
    ]);
}

// --- test cases ------------------------------------------
function testH264RawStream(test, pass, miss) {
    //
    // $ npm run make_asset
    //
    // $ npm run el
    //
    // Raw H.264 file stream ( ff/png.00.mp4.264 ) の中身を確認する

    var url1 = "../assets/ff/png.00.mp4.264";

    var task = new Task("testH264RawStream", 1, function(error, buffer) {
        // --- decode Raw H.264 stream ---
        var videoH264RawStream = buffer[0];
        var videoNALUnitObject = H264["convertRawStreamToNALUnitObject"]( videoH264RawStream );

        HexDump(videoH264RawStream);

        console.dir(videoNALUnitObject[0]);
        console.dir(videoNALUnitObject[1]);

        if (videoNALUnitObject[0].NAL_UNIT_TYPE === "SEI" &&
            videoNALUnitObject[1].NAL_UNIT_TYPE === "IDR") {
            test.done(pass());
        } else {
            test.done(miss());
        }
    });

    FileLoader.toArrayBuffer(url1, function(buffer, url) {
        console.log("LOAD FROM: ", url, buffer.byteLength);
        task.buffer[0] = new Uint8Array(buffer);
        task.pass();
    });
}

return test.run();

})(GLOBAL);

