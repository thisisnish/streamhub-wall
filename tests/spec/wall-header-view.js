'use strict';

var jasmine = require('jasmine');
var jasmineJquery = require('jasmine-jquery');
var WallHeaderView = require('streamhub-wall/wall-header-view');
var auth = require('auth');

describe('A MediaWallHeaderView', function () {
    beforeEach(function () {
        auth.delegate({});
    });
    describe('upload button', function () {
        it('does not render if there is no auth login delegate', function () {
            var wallHeaderView = new WallHeaderView();
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);
        });
        it('is present if there is an auth login delegate and collection', function () {
            auth.delegate({
                login: function () {}
            });
            var fakeCollection = {
                pipe: function () {}
            };
            var wallHeaderView = new WallHeaderView({
                collection: fakeCollection // may not always work
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
        });
        it('it renders if .setCollection is called after construction', function () {
            auth.delegate({
                login: function () {}
            });
            var fakeCollection = {
                pipe: function () {}
            };
            var wallHeaderView = new WallHeaderView();

            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);

            wallHeaderView.setCollection(fakeCollection);
            expect(wallHeaderView.$el.children().length).toBe(1);
        });
    });
});
