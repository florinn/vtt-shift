const moment = require('moment')
const split = require('split2')
const pumpify = require('pumpify')
const utf8 = require('to-utf-8')
const through = require('through2')

module.exports = function (opts) {
  opts = opts || {}
  const offsetMs = opts.offsetMs || 0

  const TIME_FORMAT = 'HH:mm:ss.SSS'
  const TIME_SEPARATOR = ' --> '

  function parseTimes (line) {
    return line.split(TIME_SEPARATOR)
      .map(timeString => moment(timeString.trim(), TIME_FORMAT))
  }

  function shiftTimeLine (line, offsetMs) {
    return parseTimes(line)
      .map(time => time.add(offsetMs, 'ms').format(TIME_FORMAT))
      .join(TIME_SEPARATOR)
  }

  function isTimeLine (line) {
    return line.indexOf(TIME_SEPARATOR) > -1
  }

  let buf = []

  function shift () {
    const shiftedBuf = buf.map(line =>
      isTimeLine(line)
        ? shiftTimeLine(line, offsetMs)
        : line
    )
    return shiftedBuf.join('\r\n') + '\r\n\r\n'
  }

  function write (line, enc, cb) {
    if (line.trim()) {
      buf.push(line.trim())
      return cb()
    }

    line = shift()

    buf = []
    cb(null, line)
  }

  function flush (cb) {
    if (buf.length) { this.push(shift()) }
    cb()
  }

  const parse = through.obj(write, flush)
  return pumpify(utf8({ newline: false, detectSize: 4095 }), split(), parse)
}
