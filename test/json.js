const assert = require('assert');
const BigNumber = require('bignumber.js');
const json = require('../lib/json');

describe('json', function() {
  describe('#parse()', function() {
    it('should properly parse big integers', function() {
      // DEV: This test case is from: https://github.com/brettlangdon/node-dogapi/issues/16
      const data = '{"id": 2868860079149422351}';
      const parsed = json.parse(data);
      // `parsed.id` is an instance of `BigNumber`
      assert.equal(parsed.id.toString(), '2868860079149422351');
    });
  });

  describe('#stringify()', function() {
    it('should properly parse big integers', function() {
      // DEV: This test case is from: https://github.com/brettlangdon/node-dogapi/issues/16
      const data = {id: new BigNumber('2868860079149422351')};
      const stringified = json.stringify(data);
      // Yeah, it ends up being a string and not an int, but mostly we
      // want to make sure it doesn't throw an error or provide the wrong number
      assert.equal(stringified, '{"id":"2868860079149422351"}');
    });
  });
});
