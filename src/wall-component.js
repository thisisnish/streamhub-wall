var inherits = require('inherits');
var View = require('view');
var WallView = require('./wall-view');
var wallComponentTemplate = require('hgn!./templates/wall-component');
var wallComponentStyles = require('css!./styles/wall-component.css');
var Passthrough = require('stream/passthrough');
var PostContentButton = require('streamhub-input/content-editor/button');

/**
 * LiveMediaWall Component
 * It has a wall-view and a streamhub-input
 * @constructor
 */
var WallComponent = module.exports = function (opts) {
    View.apply(this, arguments);
    opts = opts || {};
    this._wallView = opts.wallView || new WallView({
        autoRender: false,
        initial: opts.initial,
        showMore: opts.showMore,
        modal: opts.modal
    });
    // TODO: Put in app header
    this._postButton = opts.postButton || new PostContentButton();
    if (opts.collection) {
        this.setCollection(opts.collection);
    }
    if ( ! opts.autoRender) {
        this.render();
    }
};

inherits(WallComponent, View);

WallComponent.prototype.template = wallComponentTemplate;

/**
 * Render the WallComponent
 */
WallComponent.prototype.render = function () {
    View.prototype.render.apply(this, arguments);
    var $wallContainer = this.$("*[data-lf-view='streamhub-wall/wall-view']");
    $wallContainer.append(this._wallView.$el);
    this._wallView.render();
    var $postButtonContainer = this.$('.hub-wall-post-button');
    $postButtonContainer.append(this._postButton.$el);
    this._postButton.render();
};

/**
 * Set the Collection shown in this WallComponent
 * @param {collection}
 */
WallComponent.prototype.setCollection = function (collection) {
    if (this._collection) {
        this._collection.unpipe(this._wallView)
    }
    this._collection = collection;
    this._collection.pipe(this._wallView);
};
