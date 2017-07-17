# vtt-shift [![build badge](https://travis-ci.org/florinn/vtt-shift.svg?branch=master)](https://travis-ci.org/florinn/vtt-shift)

Transform stream that shifts [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) text tracks by the specified offset.

```
npm install vtt-shift
```

## Usage

``` js
const vttshift = require('vtt-shift')
const fs = require('fs')

const options = { 
    offsetMs: 1000 // offset in milliseconds
}

fs.createReadStream('some-subtitle-file.vtt')
  .pipe(vttshift(options))
  .pipe(fs.createWriteStream('some-subtitle-file-shifted-by-1sec.vtt'))
```

## Command line usage

There is also a command line tool available

```
npm install -g vtt-shift
vtt-shift --help
vtt-shift some-subtitle-file.vtt --offsetMs=1000 --out=some-subtitle-file-shifted-by-1sec.vtt
```

## License

MIT