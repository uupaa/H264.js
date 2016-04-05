# H264.js [![Build Status](https://travis-ci.org/uupaa/H264.js.svg)](https://travis-ci.org/uupaa/H264.js)

[![npm](https://nodei.co/npm/uupaa.h264.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.h264.js/)

H264/AVC, MPEG2-TS ByteStream, H.264 RawStream to NALUnit.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/H264.js/wiki/)
- [API Spec](https://github.com/uupaa/H264.js/wiki/H264)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/H264.js"></script>
<script>

var videoH264RawStream = new Uint8Array(...)
var videoNALUnitObject = H264.convertRawStreamToNALUnitObject( videoH264RawStream );

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/H264.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/H264.js");

```

