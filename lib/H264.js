(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("H264", function moduleClosure(global) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var HexDump = global["WebModule"]["HexDump"];
var NALUnit = global["WebModule"]["NALUnit"];

// --- define / local variables ----------------------------
var VERIFY  = global["WebModule"]["verify"]  || false;
var VERBOSE = global["WebModule"]["verbose"] || false;

// --- class / interfaces ----------------------------------
var H264 = {
    "convertByteStreamToNALUnit":      H264_convertByteStreamToNALUnit,       // H264.convertByteStreamToNALUnit(stream:Uint8Array):NALUnitUint8ArrayArray
    "convertRawStreamToNALUnitObject": H264_convertRawStreamToNALUnitObject,  // H264.convertRawStreamToNALUnitObject(stream:Uint8Array):NALUnitObjectArray
    "repository": "https://github.com/uupaa/H264.js",
};

// --- implements ------------------------------------------
function H264_convertByteStreamToNALUnit(stream) { // @arg Uint8Array - ByteStreamFormat [00, 00, 00, 01, 09, F0 ...]
                                                   // @ret NALUnitUint8ArrayArray - [ NALUnitUint8ArrayArray, ... ]
                                                   // @desc convert Annex B ByteStrem format to NALUnit(NAL file format).
                                                   //        stream: `| 00 00 00 01 | NALUnit | 00 00 01    | NALUnit | ...`
                                                   //        result: `|               NALUnit |               NALUnit | ...`
//{@dev
    if (VERIFY) {
        $valid($type(stream, "Uint8Array"), H264_convertByteStreamToNALUnit, "stream");
        // need leading 2byte zero( 00 00 )
        $valid(stream.length >= 4 && !stream[0] && !stream[1],
                                            H264_convertByteStreamToNALUnit, "stream");
    }
//}@dev

    var result = []; // [NALUnit, ...] without StartCode
    var cursor = 0;
    var start  = 0;  // NALUnit start position
    var end    = 0;  // NALUnit end position
    var streamLength = stream.length;

    // --- slide buffer ---
    var a = 0; // stream[current - 3] byte
    var b = 0; // stream[current - 2] byte
    var c = 0; // stream[current - 1] byte
    var d = 0; // stream[current] byte

    // --- split NALUnit token ---
    // | StartCode | NALUnit        | StartCode | NALUnit        | ...
    // | 00 00 01  | xx xx xx xx xx | 00 00 01  | xx xx xx xx xx | ...
    //               ^           ^
    //               |           |
    //             start        end
    while (cursor < streamLength) {
        a = b;
        b = c;
        c = d;
        d = stream[cursor++] || 0;
        if (b === 0x00 && c === 0x00 && d === 0x01) { // find StartCode(00 00 00 01) or (00 00 01)
            if (start !== 0) {
                end = cursor - ((a === 0x00) ? 4 : 3); // (00 00 00 01) or (00 00 01)
                result.push( stream.subarray(start, end) );
            }
            start = cursor;
        }
    }
    if (start !== cursor) { // add last NALUnit
        result.push( stream.subarray(start, cursor) );
    }

//{@dev
    if (VERBOSE) {
        HexDump(stream, {
            "title": "H264_convertByteStreamToNALUnit",
            "rule": {
                "StartCode(00 00 01)": { "values": [0x00, 0x00, 0x01], bold: true, "style": "color:red" },
                "AUD":                 { "values": [0x09, 0xF0],       bold: true, "style": "color:red" },
                "EP3B(00 00 03 00)":   { "values": [0x00, 0x00, 0x03, 0x00],       "style": "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 01)":   { "values": [0x00, 0x00, 0x03, 0x01],       "style": "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 02)":   { "values": [0x00, 0x00, 0x03, 0x02],       "style": "color:tomato;background-color:yellow" },
                "EP3B(00 00 03 03)":   { "values": [0x00, 0x00, 0x03, 0x03],       "style": "color:tomato;background-color:yellow" },
                "PPS (4 byte)":        { "values": [0x68, 0xCE, 0x0F, 0x2C],       "bold": true, "style": "background-color:gold"  },
                "PPS (5 byte)":        { "values": [0x68, 0xCE, 0x0F, 0x2C, 0x80], "bold": true, "style": "color:red" },
            }
        });
    }
//}@dev
    return result;
}

function H264_convertRawStreamToNALUnitObject(stream) { // @arg Uint8Array - [NALUnit, ...]
                                                        // @ret NALUnitObjectArray - [NALUnitObject, ...]
                                                        // @desc convert NALUnit to NALUnitObject.
                                                        //        Uint8Array: [NALUnitSize + NALUnit, ...]
                                                        //        NALUnitObjectArray:      [NALUnitObject, ...]
                                                        //        NALUnitObject:           { nal_ref_idc, nal_unit_type, index, size, data, offset, type }
//{@dev
    if (VERIFY) {
        $valid($type(stream, "Uint8Array"), H264_convertRawStreamToNALUnitObject, "stream");
    }
//}@dev

    var result = []; // [NALUnitObject, ...]
    var index  = 0;
    var cursor = 0;
    var streamLength = stream.length;

    while (cursor < streamLength) {
        var nalUnitSize = stream[cursor + 0] << 24 |
                          stream[cursor + 1] << 16 |
                          stream[cursor + 2] <<  8 |
                          stream[cursor + 3];

        var nalUnit = stream.subarray(cursor, cursor + nalUnitSize + 4);
        var nal_ref_idc   = (nalUnit[4] & 0x60) >> 5;
        var nal_unit_type =  nalUnit[4] & 0x1F;
        var nalUnitObject = {
            "nal_ref_idc":      nal_ref_idc,
            "nal_unit_type":    nal_unit_type,
            "nal_unit_size":    nalUnitSize,
            "index":            index,
            "data":             nalUnit,
            "NAL_UNIT_TYPE":    NALUnitType[nal_unit_type],
        };

        result.push( nalUnitObject );

        if (VERBOSE) {
            HexDump(nalUnitObject["data"], {
                "title": "H264_convertRawStreamToNALUnitObject: " + nalUnitObject["type"],
                "rule": {
                    "NALUnitSize": { "begin": 0, "end": 4, "bold": true },
                    "AUD":         { "values": [0x09, 0xF0], "bold": true, "style": "color:red" },
                }
            });
        }
        cursor += nalUnitSize + 4;
        index++;
    }
    return result;
}



return H264; // return entity

});

