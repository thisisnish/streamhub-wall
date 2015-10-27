'use strict';

var jasmine = require('jasmine');
var jasmineJquery = require('jasmine-jquery');
var WallHeaderView = require('streamhub-wall/wall-header-view');
var auth = require('auth');
var postButtons = require('streamhub-wall').postButtons;
var ContentEditorButton = require('streamhub-input').ContentEditorButton;
var UploadButton = require('streamhub-input').UploadButton;

var fakeCollection = {
    pipe: function () {}
};

describe('A MediaWallHeaderView', function () {
    beforeEach(function () {
        auth.delegate({});
    });
    describe('opts.postButton', function () {
        beforeEach(function () {
            // Only worry about cases where an auth delegate is set.
            auth.delegate({
                login: function () {}
            });
        })
        it('defaults to false, and no post button appears', function () {
            var wallHeaderView = new WallHeaderView({
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);
        });
        it('when false, no post button appears', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: false,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);
        });
        it('when true, uses ContentEditorButton w/ mediaEnabled', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: true,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof ContentEditorButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mediaEnabled).toBe(true);
        });
        it('when .content, uses ContentEditorButton w/out mediaEnabled', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.content,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof ContentEditorButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mediaEnabled).toBe(false);
        });
        it('when .contentWithPhotos, uses ContentEditorButton w/ mediaEnabled', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.contentWithPhotos,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof ContentEditorButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mediaEnabled).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mimetypes).toEqual(WallHeaderView.mimetypes.photo);
        });
        it('when .photo, uses UploadButton with photo mimetypes', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.photo,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof UploadButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.pick.mimetypes).toEqual(WallHeaderView.mimetypes.photo);
        });
        it('when .video, uses UploadButton with video mimetypes', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.video,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof UploadButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.pick.mimetypes).toEqual(WallHeaderView.mimetypes.video);
        });
        it('when .photosAndVideos, uses UploadButton with photo+video mimetypes', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.photosAndVideos,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof UploadButton).toBe(true);

            var mimetypes = WallHeaderView.mimetypes.video.concat(WallHeaderView.mimetypes.photo);
            expect(wallHeaderView._postButton._input.opts.pick.mimetypes).toEqual(mimetypes);
        });
        it('when .contentWithVideos, uses ContentEditorButton with mediaEnabled and video mimetypes', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.contentWithVideos,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof ContentEditorButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mediaEnabled).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mimetypes).toEqual(WallHeaderView.mimetypes.video);
        });
        it('when .contentWithPhotosAndVideos, uses ContentEditorButton with mediaEnabled and photo+video mimetypes', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: postButtons.contentWithPhotosAndVideos,
                collection: fakeCollection
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(1);
            expect(wallHeaderView._postButton instanceof ContentEditorButton).toBe(true);
            expect(wallHeaderView._postButton._input.opts.mediaEnabled).toBe(true);

            var mimetypes = WallHeaderView.mimetypes.video.concat(WallHeaderView.mimetypes.photo);
            expect(wallHeaderView._postButton._input.opts.mimetypes).toEqual(mimetypes);
        });
    });
    describe('upload button', function () {
        it('does not render if there is no auth login delegate', function () {
            var wallHeaderView = new WallHeaderView({
                postButton: true
            });
            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);
        });
        it('it renders if .setCollection is called after construction', function () {
            auth.delegate({
                login: function () {}
            });
            var fakeCollection = {
                pipe: function () {}
            };
            var wallHeaderView = new WallHeaderView({
                postButton: true
            });

            wallHeaderView.render();
            expect(wallHeaderView.$el.children().length).toBe(0);

            wallHeaderView.setCollection(fakeCollection);
            expect(wallHeaderView.$el.children().length).toBe(1);
        });
    });
});
