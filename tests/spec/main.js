var jasmine = require('jasmine');
var streamhubWall = require('streamhub-wall');

describe('streamhub-wall', function () {
    it('exports a constructor function', function () {
        expect(typeof streamhubWall).toBe('function');
    });
    it('exports .WallView, which is a constructor function', function () {
        expect(typeof streamhubWall.WallView).toBe('function');
    });
});
