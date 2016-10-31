'use strict';

var WallComponent = require('streamhub-wall/wall-component');
var MockCollection = require('streamhub-sdk-tests/mocks/collection/mock-collection');
var packageAttribute = require('streamhub-wall/package-attribute');
var auth = require('auth');


function buildWall(opts, collection) {
  var wall = new WallComponent(opts);
  spyOn(collection, 'initFromBootstrap').and.callFake(function () {
    wall._hasReceivedTranslations = true;
  });
  return wall;
}


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
    wall.destroy();
  });

  it('has a wall-header-view menu when rendered', function () {
    var wall = new WallComponent();
    wall.render();
    expect(wall._headerView).toBeTruthy();
    expect(wall.$el.find('menu').length).toBe(1);
    wall.destroy();
  });

  it('has css class .streamhub-wall-component', function () {
    var wall = new WallComponent();
    wall.render();
    expect(wall.$el.find('.streamhub-wall-component').length).toBe(1);
    wall.destroy();
  });

  describe('opts.collection', function () {
    it('can be just a POJO', function () {
      var collectionOpts = {
        'network': 'labs-t402.fyre.co',
        'siteId': '303827',
        'articleId': 'xbox-0',
        'environment': 't402.livefyre.com'
      };
      var wall = new WallComponent({
        collection: collectionOpts
      });
      expect(wall._collection.network).toBe(collectionOpts.network);
      expect(typeof wall._collection.pipe).toBe('function');
      wall.destroy();
    });
  });

  describe('upload button', function () {
    it('does not render if there is no auth login delegate', function () {
      var wall = new WallComponent();
      wall.render();
      expect(wall.$el.find('menu').children().length).toBe(0);
      wall.destroy();
    });

    it('is present if there is an auth login delegate and collection and opts.postButton is truthy', function () {
      auth.delegate({
        login: function () {}
      });

      var collection = new MockCollection();
      var wall = buildWall({
        collection: collection, // may not always work
        postButton: true
      }, collection);
      wall.render();
      expect(wall.$el.find('menu').children().length).toBe(1);
      wall.destroy();
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
      }];
            // try on construction
      trials.forEach(function (trial) {
        var collection = new MockCollection();
        var wall = buildWall({
          collection: collection, // may not always work
          postButton: trial.postButton
        }, collection);
        wall._hasReceivedTranslations = true;
        wall.configure({forceReconstruct: true});
        expect(wall.$el.find('menu').children().length).toBe(1);
        expect(wall.$el.find('menu').children().hasClass(trial.buttonHasClass)).toBe(true);
        wall.destroy();
      });
            // try changing at runtime
      trials.forEach(function (trial) {
        var collection = new MockCollection();
        var wall = buildWall({
          collection: collection
        }, collection);
        wall._hasReceivedTranslations = true;
        wall.configure({forceReconstruct: true});
        wall.configure({
          postButton: trial.postButton
        });
        expect(wall.$el.find('menu').children().length).toBe(1);
        expect(wall.$el.find('menu').children().hasClass(trial.buttonHasClass)).toBe(true);
        wall.destroy();
      });
    });

    it('can be unset at runtime', function () {
      auth.delegate({
        login: function () {}
      });

      var collection = new MockCollection();
      var wall = buildWall({
        collection: collection, // may not always work
        postButton: true
      }, collection);
      wall._hasReceivedTranslations = true;
      wall.configure({forceReconstruct: true});
      expect(wall.$el.find('menu').children().length).toBe(1);
            // ok now to remove it by specifying false
      wall.configure({
        postButton: false
      });
      expect(wall.$el.find('menu').children().length).toBe(0);
            // restore
      wall.configure({
        postButton: true
      });
      expect(wall.$el.find('menu').children().length).toBe(1);
            // ok now to remove it by specifying undefined
      wall.configure({
        postButton: undefined
      });
      expect(wall.$el.find('menu').children().length).toBe(0);
      wall.destroy();
    });

    it('can be translated', function () {
      auth.delegate({
        login: function () {}
      });

      var collection = new MockCollection();
      var translation = 'What up!';
      var wall = buildWall({
        collection: collection, // may not always work
        postButton: 'content',
        postButtonText: translation
      }, collection);
      spyOn(wall, 'canRender').and.returnValue(true);
      wall.configure({forceReconstruct: true});
      expect(wall.$el.find('.lf-comment-btn').html()).toBe(translation);
      wall.destroy();
    });
  });

  describe('.enteredView', function () {
    it('is a function', function () {
      var wall = new WallComponent();
      expect(typeof wall.enteredView).toBe('function');
      wall.destroy();
    });
  });

  describe('.setCollection', function () {
    var wall;
    var collection = new MockCollection();

    beforeEach(function () {
      wall = buildWall({}, collection);
      spyOn(wall, 'canRender').and.returnValue(true);
    });

    afterEach(function () {
      wall.destroy();
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
      spyOn(wall, '_initializeWallView').and.callThrough();
      var oldWallView = wall._wallView;
      wall.setCollection(collection);
      expect(wall._initializeWallView).toHaveBeenCalled();
      expect(wall._wallView).not.toBe(oldWallView);
    });
  });
});
