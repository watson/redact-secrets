const test = require('tape')
const clone = require('clone')
const redact = require('./')

test('redact.map', function (t) {
  const input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }]
  }

  const expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }]
  }

  const orig = clone(input)
  const result = redact('redacted').map(input)

  t.deepEqual(result, expected)
  t.deepEqual(input, orig)
  t.end()
})

test('redact.map (user provided keys/values)', function (t) {
  const input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }],
    userProvidedSecretKey: '123',
    abc: 'userProvidedSecretValue'
  }

  const expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }],
    userProvidedSecretKey: 'redacted',
    abc: 'redacted'
  }

  const orig = clone(input)
  const result = redact('redacted', {
    keys: [/userProvidedSecretKey/i],
    values: [/userProvidedSecretValue/i]
  }).map(input)

  t.deepEqual(result, expected)
  t.deepEqual(input, orig)
  t.end()
})

test('redact.forEach', function (t) {
  const input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }]
  }

  const expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }]
  }

  const result = redact('redacted').forEach(input)

  t.equal(result, undefined)
  t.deepEqual(input, expected)
  t.end()
})

test('redact.forEach (user provided keys/values)', function (t) {
  const input = {
    foo: 'non-secret',
    secret: 'secret',
    sub1: {
      foo: 'non-secret',
      password: 'secret'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'secret'
    }],
    userProvidedSecretKey: '123',
    abc: 'userProvidedSecretValue'
  }

  const expected = {
    foo: 'non-secret',
    secret: 'redacted',
    sub1: {
      foo: 'non-secret',
      password: 'redacted'
    },
    sub2: [{
      foo: 'non-secret',
      token: 'redacted'
    }],
    userProvidedSecretKey: 'redacted',
    abc: 'redacted'
  }

  const result = redact('redacted', {
    keys: [/userProvidedSecretKey/i],
    values: [/userProvidedSecretValue/i]
  }).forEach(input)

  t.equal(result, undefined)
  t.deepEqual(input, expected)
  t.end()
})
