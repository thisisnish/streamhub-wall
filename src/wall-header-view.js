var auth = require('auth');
var inherits = require('inherits');
var View = require('view');
var Passthrough = require('stream/passthrough');
var PostContentButton = require('streamhub-input').ContentEditorButton;
var packageAttribute = require('./package-attribute');
var ModalView = require('streamhub-sdk/modal');

/**
 * Header of LiveMediaWall.
 * It has a streamhub-input button iff auth.hasDelegate();
 * @constructor
 */
var WallHeaderView = module.exports = function (opts) {
    View.apply(this, arguments);
    opts = opts || {};
    this._rendered = false;
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
        renderPostButtonIfCollection.call(this, true);
    } else {
        postCommand.on('change:canExecute', renderPostButtonIfCollection.bind(this));
    }
    this._rendered = true;
    function renderPostButtonIfCollection(showPostButton) {
        if (! this._collection) {
            return;
        }
        renderPostButton.call(this, showPostButton);
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
    if (this._rendered) {
        this.render();
    }
};

/**
 * Create the Button that will let the user post content into the
 * right Collection
 */
WallHeaderView.prototype._createPostButton = function (opts) {
    var button = new PostContentButton({
        mediaEnabled: true,
        modal: createModal(),
        input: createInput()
    });
    // Create a Modal that will add the streamhub-wall#vN attribute
    // to its parent when it is shown, so that our css rules can be namespaced
    // nicely
    function createModal() {
        var modal = new ModalView();
        packageAttribute.decorateModal(modal);
        return modal;
    }
    // Create a custom ContentEditor input whose UploadButton will launch
    // a modal that has the right packageAttribute on its parent
    function createInput() {
        var input = PostContentButton.prototype.createInput.call(this, {
            mediaEnabled: true
        });
        // patch .createUploadButton to create one that uses a modal
        // with streamhub-wall packageAttribute
        var ogCreateUploadButton = input.createUploadButton;
        input.createUploadButton = function (opts) {
            opts = opts || {};
            opts.modal = createModal();
            var uploadButton = ogCreateUploadButton.call(this, opts);
            return uploadButton;
        }
        return input;
    }
    return button;
};
