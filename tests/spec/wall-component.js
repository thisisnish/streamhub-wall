'use strict';

var jasmine = require('jasmine');
var jasmineJquery = require('jasmine-jquery');
var streamhubWall = require('streamhub-wall');
var WallComponent = require('streamhub-wall/wall-component');
var MockCollection = require('streamhub-sdk-tests/mocks/collection/mock-collection');
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
        it('can be set as one of content, photo, or contentWithPhoto', function () {
            auth.delegate({
                login: function () {}
            });
            var trials = [{
                postButton: 'content',
                buttonHasClass: 'lf-comment-btn'  
            },{
                postButton: 'photo',
                buttonHasClass: 'lf-hub-upload-btn'  
            },{
                postButton: 'contentWithPhoto',
                buttonHasClass: 'lf-comment-btn'  
            }]
            // try on construction
            trials.forEach(function (trial) {
                var fakeCollection = {
                    pipe: function () {}
                };
                var wall = new WallComponent({
                    collection: fakeCollection, // may not always work
                    postButton: trial.postButton
                });
                wall.render();
                expect(wall.$('menu').children().length).toBe(1);
                expect(wall.$('menu').children().hasClass(trial.buttonHasClass)).toBe(true);
            });
            // try changing at runtime
            trials.forEach(function (trial) {
                var fakeCollection = {
                    pipe: function () {}
                };
                var wall = new WallComponent({
                    collection: fakeCollection
                });
                wall.render();
                wall.configure({
                    postButton: trial.postButton
                })
                expect(wall.$('menu').children().length).toBe(1);
                expect(wall.$('menu').children().hasClass(trial.buttonHasClass)).toBe(true);
            });          
        });
        it('can be unset at runtime', function () {
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
            // ok now to remove it by specifying false
            wall.configure({
                postButton: false
            });
            expect(wall.$('menu').children().length).toBe(0);
            // restore
            wall.configure({
                postButton: true
            });
            expect(wall.$('menu').children().length).toBe(1);
            // ok now to remove it by specifying undefined
            wall.configure({
                postButton: undefined
            });
            expect(wall.$('menu').children().length).toBe(0);
        });
    });
    describe('.enteredView', function () {
        it('is a function', function () {
            var wall = new WallComponent();
            expect(typeof wall.enteredView).toBe('function');
        });
    });
    describe('.setCollection', function () {
        var wall;
        var collection = new MockCollection();

        beforeEach(function () {
            wall = new WallComponent();
        });
        it('updates #_wallView.collection property', function () {
            wall.setCollection(collection);
            expect(wall._collection).toBe(collection);
        });
        it('destroys current wallView', function () {
            spyOn(wall._wallView, 'destroy');
            var oldWallView = wall._wallView;
            wall.setCollection(collection);
            expect(oldWallView.destroy).toHaveBeenCalled();
        });
        it('initializes a new wallView replacing the existing one', function () {
            spyOn(wall, '_initializeWallView').andCallThrough();
            var oldWallView = wall._wallView;
            wall.setCollection(collection);
            expect(wall._initializeWallView).toHaveBeenCalled();
            expect(wall._wallView).not.toBe(oldWallView);
        });
    });
});
