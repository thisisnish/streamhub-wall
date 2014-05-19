var inherits = require('inherits');
var View = require('view');
var WallView = require('./wall-view');
var wallComponentTemplate = require('hgn!./templates/wall-component');
var wallComponentStyles = require('css!?prefix=[data-lf-module=%22streamhub-wall#3.0.0%22]:./styles/wall-component.css');
var inputButtonStyles = require('css!?prefix=[data-lf-module=%22streamhub-wall#3.0.0%22]:streamhub-input/../dist/streamhub-input.min.css');
// var wallComponentStyles1 = require('css!./style.css');
var Passthrough = require('stream/passthrough');
var PostContentButton = require('streamhub-input/javascript/content-editor/button');

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
    this._postButton = opts.postButton || new PostContentButton({
        mediaEnabled: true
    });
    if (opts.collection) {
        this.setCollection(opts.collection);
    }
    if ( ! opts.autoRender) {
        this.render();
    }
};

inherits(WallComponent, View);

WallComponent.prototype.template = wallComponentTemplate;

WallComponent.prototype.setElement = function () {
    View.prototype.setElement.apply(this, arguments);
    this.$el.attr('data-lf-module','streamhub-wall#3.0.0');
};

/**
 * Render the WallComponent
 */
WallComponent.prototype.render = function () {
    View.prototype.render.apply(this, arguments);
    var $wallEl = this.$("*[data-lf-view='streamhub-wall/wall-view']");
    this._wallView.setElement($wallEl);
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
    // pipe zeh button
    this._postButton.pipe(collection);
};
