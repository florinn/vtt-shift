#!/usr/bin/env node

var vttshift = require('./')
var minimist = require('minimist')
var fs = require('fs')

var argv = minimist(process.argv.slice(2), {
  alias: {out: 'o', help: 'h'},
  default: {out: '-'}
})

if (argv.help) {
  console.error('Usage: vtt-shift [filename] [--offsetMs=<value>] [--out=<filename>?]')
  process.exit(1)
}

process.stdout.on('error', function (err) {
  if (err.code !== 'EPIPE') throw err
})

var filename = argv._[0] || '-'
var options = { offsetMs: argv.offsetMs }
var input = filename === '-' ? process.stdin : fs.createReadStream(filename)
var output = argv.out === '-' ? process.stdout : fs.createWriteStream(argv.out)

input.pipe(vttshift(options)).pipe(output)
