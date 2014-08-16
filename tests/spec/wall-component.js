'use strict';

var jasmine = require('jasmine');
var jasmineJquery = require('jasmine-jquery');
var streamhubWall = require('streamhub-wall');
var WallComponent = require('streamhub-wall/wall-component');
var packageAttribute = require('streamhub-wall/package-attribute');
var auth = require('auth');

describe('A MediaWallComponent', function () {
    beforeEach(function () {
        auth.delegate({});
    });
    it('is a function', function () {
        expect(typeof WallComponent).toBe('function');
    });
    it('.el has a packageAttribute with the right value', function () {
        var attr = packageAttribute.attribute;
        var value = packageAttribute.value;
        var wall = new WallComponent();
        wall.render();
        expect(wall.$el.attr(attr).indexOf(value)).not.toBe(-1);
    });
    it('has a wall-header-view menu when rendered', function () {
        var wall = new WallComponent();
        wall.render();
        expect(wall._headerView).toBeTruthy();
        expect(wall.$('menu').length).toBe(1);
    });
    it('has css class .streamhub-wall-component', function () {
        var wall = new WallComponent();
        wall.render();
        expect(wall.$('.streamhub-wall-component').length).toBe(1);
    });
    describe('opts.collection', function () {
        it('can be just a POJO', function () {
            var collectionOpts = {
                "network": "labs-t402.fyre.co",
                "siteId": "303827",
                "articleId": "xbox-0",
                "environment": "t402.livefyre.com"
            };
            var wall = new WallComponent({
                collection: collectionOpts
            });
            expect(wall._collection.network).toBe(collectionOpts.network);
            expect(typeof wall._collection.pipe).toBe('function');
        })
    });
    describe('upload button', function () {
        it('does not render if there is no auth login delegate', function () {
            var wall = new WallComponent();
            wall.render();
            expect(wall.$('menu').children().length).toBe(0);
        });
        it('is present if there is an auth login delegate and collection and opts.postButton is truthy', function () {
            auth.delegate({
                login: function () {}
            });
            var fakeCollection = {
                pipe: function () {}
            };
            var wall = new WallComponent({
                collection: fakeCollection, // may not always work
                postButton: true
            });
            wall.render();
            expect(wall.$('menu').children().length).toBe(1);
        });
    });
});
