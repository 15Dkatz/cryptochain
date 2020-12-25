'use strict';

const { cryptoHash } = require('../../utils');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
  });

  it('produces the same hash with any arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
  });

  it('produces a unique hash when the properties have changed on an input', () => {
    const foo = {};
    const originalHash = cryptoHash(foo);
    foo['a'] = 'a';
    expect(cryptoHash(foo)).not.toEqual(originalHash);
  });

  it('produces the same hash for two object with the same properties in any order', () => {
    expect(cryptoHash({ a:'one', b:'two', c:'three' })).toEqual(cryptoHash({ c:'three', a:'one', b:'two' }));
  });

  it('produces the same hash for an array of objects independant of the order', () => {
    expect(cryptoHash([{ a:'one', b:'two', c:'three' }, { d:'four', e:'five' }])).toEqual(cryptoHash([{ e:'five', d:'four' }, { c:'three', a:'one', b:'two' }]));
  });

  it('produces the same hash for nested object', () => {
    expect(cryptoHash({ a:'one', b: { c:'three' } })).toEqual(cryptoHash({ b: { c: 'three' }, a:'one' }));
  });
});
