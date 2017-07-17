var tape = require('tape')
var vttshift = require('../')
var concat = require('concat-stream')
var fs = require('fs')

tape('empty', function (t) {
  var shift = vttshift()
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), '')
    t.end()
  }))
})

tape('one entry - no shift', function (t) {
  var shift = vttshift()
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('two entries - no shift', function (t) {
  var shift = vttshift()
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('one entry - shift 1000 msec', function (t) {
  var shift = vttshift({ offsetMs: 1000 })
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:11.500 --> 00:00:14.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('two entries - shift 1000 msec', function (t) {
  var shift = vttshift({ offsetMs: 1000 })
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:11.500 --> 00:00:14.000\r\nthis is a test\r\n\r\n2\r\n00:00:15.500 --> 00:00:16.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('one entry - shift -1000 msec', function (t) {
  var shift = vttshift({ offsetMs: -1000 })
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:09.500 --> 00:00:12.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('two entries - shift -1000 msec', function (t) {
  var shift = vttshift({ offsetMs: -1000 })
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:09.500 --> 00:00:12.000\r\nthis is a test\r\n\r\n2\r\n00:00:13.500 --> 00:00:14.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})

tape('utf8 encoding', function (t) {
  var shift = vttshift()
  fs.createReadStream('./test/test.vtt').pipe(shift).pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:07:02.990 --> 00:07:08.204\r\n<i>Der ligger en bar ved stationen.</i>\r\n<i>Caffé Ligeti på Via Voltorno.</i>\r\n\r\n2\r\n00:08:50.431 --> 00:08:55.603\r\nGå til højre udenfor og tag anden vej\r\npå venstre hånd. Via Magenta.\r\n\r\n3\r\n01:09:20.644 --> 01:09:23.564\r\n- Må jeg spørge om noget?\r\n- Selvfølgelig.\r\n\r\n')
    t.end()
  }))
})

tape('missing file ending CRLF', function (t) {
  var shift = vttshift()
  shift.write('WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n')
  shift.end()
  shift.pipe(concat(function (data) {
    t.same(data.toString(), 'WEBVTT FILE\r\n\r\n1\r\n00:00:10.500 --> 00:00:13.000\r\nthis is a test\r\n\r\n2\r\n00:00:14.500 --> 00:00:15.000\r\nthis is a test\r\n\r\n')
    t.end()
  }))
})
