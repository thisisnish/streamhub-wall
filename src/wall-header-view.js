var auth = require('auth');
var inherits = require('inherits');
var View = require('view');
var inputButtonStyles = require('css!?prefix=streamhubWallPackageVersion:streamhub-input/../dist/streamhub-input.min.css');
var Passthrough = require('stream/passthrough');
var PostContentButton = require('streamhub-input/javascript/content-editor/button');

/**
 * Header of LiveMediaWall.
 * It has a streamhub-input button iff auth.hasDelegate();
 * @constructor
 */
var WallHeaderView = module.exports = function (opts) {
    View.apply(this, arguments);
    opts = opts || {};
    this._postButton = opts.postButton || this._createPostButton(opts);
    if (opts.collection) {
        this.setCollection(opts.collection);
    }
};

inherits(WallHeaderView, View);

WallHeaderView.prototype.elTag = 'menu';

WallHeaderView.prototype.render = function () {
    View.prototype.render.apply(this, arguments);
    // FIXME: I shouldn't be reaching into private state to get cmd
    var postCommand = this._postButton._command;
    if (postCommand.canExecute()) {
        renderPostButton.call(this, true);
    } else {
        postCommand.on('change:canExecute', renderPostButton.bind(this));
    }
};

function renderPostButton(show) {
    var postButtonEl = this._postButton.el;
    if (show) {
        this._postButton.render();
        this.el.appendChild(postButtonEl);
    } else {
        this.el.removeChild(postButtonEl);
    }
}

/**
 * Set the Collection that the post button will pipe into
 */
WallHeaderView.prototype.setCollection = function (collection) {
    var postButton = this._postButton;
    if (this._collection) {
        postButton.unpipe(this._collection);
    }
    this._collection = collection;
    postButton.pipe(collection);
};

WallHeaderView.prototype._createPostButton = function (opts) {
    var button = new PostContentButton({
        mediaEnabled: true
    });
    return button;
};
