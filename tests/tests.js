var popup = require('../popup/popup.js');
var assert = require('assert');

describe('Popup', function() {
  describe('#getDomain()', function() {
    it('should extract the correct domain from any url thrown at it', function() {
      assert.equal(-1, popup.getDomain());
    });
  });
});
