var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('view');
var WallView = require('./wall-view');
var WallHeaderView = require('./wall-header-view');
var wallComponentStyles = require('less!streamhub-wall/styles/wall-component');
var sdkStyles = require('css!streamhub-sdk/css/style.css');
var Passthrough = require('stream/passthrough');
var PostContentButton = require('streamhub-input/javascript/content-editor/button');
var packageAttribute = require('./package-attribute');

/**
 * LiveMediaWall Component
 * It has a wall-view and a streamhub-input
 * @constructor
 */
var WallComponent = module.exports = function (opts) {
    View.apply(this, arguments);

    opts = opts || {};
    this._headerView = opts.headerView || new WallHeaderView();
    this._wallView = opts.wallView || new WallView({
        autoRender: false,
        initial: opts.initial,
        showMore: opts.showMore,
        modal: opts.modal
    });

    // Be a writable that really just proxies to the wallView
    Passthrough.apply(this, arguments);
    this.pipe(this._wallView);
    // including more, so that Collection piping works right
    this.more = new Passthrough();
    this.more.pipe(this._wallView.more);

    if (opts.collection) {
        this.setCollection(opts.collection);
    }
    if (( ! ('autoRender' in opts)) || opts.autoRender) {
        this.render();
    }
};

inherits(WallComponent, Passthrough);
inherits.parasitically(WallComponent, View);

WallComponent.prototype.setElement = function () {
    if (this.el) {
        packageAttribute.undecorate(this.el);
    }
    View.prototype.setElement.apply(this, arguments);
    packageAttribute.decorate(this.el);
};

/**
 * Render the WallComponent
 */
WallComponent.prototype.render = function () {
    View.prototype.render.apply(this, arguments);
    
    var el = this.el;
    var subviews = [this._headerView, this._wallView];

    // Clear children
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    // append container and subviews
    var container = document.createElement('div');
    $(container).addClass('streamhub-wall-component');
    var frag = document.createDocumentFragment();

    subviews.forEach(function (view) {
        container.appendChild(view.el);
    });

    frag.appendChild(container);
    el.appendChild(frag);

    // then render them
    subviews.forEach(function (view) {
        view.render();
    });

    return el;
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
    this._headerView.setCollection(collection);
};

