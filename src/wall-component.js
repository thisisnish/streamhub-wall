var inherits = require('inherits');
var View = require('view');
var WallView = require('./wall-view');
var WallHeaderView = require('./wall-header-view');
var wallComponentTemplate = require('hgn!./templates/wall-component');
var wallComponentStyles = require('css!?prefix=streamhubWallPackageVersion:./styles/wall-component.css');
var sdkStyles = require('css!?prefix=streamhubWallPackageVersion:streamhub-sdk/css/style.css');
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
    if (opts.collection) {
        this.setCollection(opts.collection);
    }
    if ( ! opts.autoRender) {
        this.render();
    }
};

inherits(WallComponent, View);

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
    var el = this.el;
    var subviews = [this._headerView, this._wallView];

    View.prototype.render.apply(this, arguments);

    // Clear children
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    // append subviews
    var frag = document.createDocumentFragment();
    subviews.forEach(function (view) {
        frag.appendChild(view.el);
    });
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
