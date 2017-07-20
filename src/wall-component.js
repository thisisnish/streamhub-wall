var $ = require('streamhub-sdk/jquery');
var ActivityTypes = require('activity-streams-vocabulary').ActivityTypes;
var AppBase = require('app-base');
var inherits = require('inherits');
var packageJson = require('json!../package.json');
var Passthrough = require('stream/passthrough');
var themableCss = require('text!streamhub-wall/styles/theme.css');
var WallView = require('./wall-view');
var WallHeaderView = require('./wall-header-view');
require('less!./styles/wall-component.less');

var xsmallTheme = require('streamhub-wall/themes/xsmall');
var smallTheme = require('streamhub-wall/themes/small');
var mediumTheme = require('streamhub-wall/themes/medium');
var largeTheme = require('streamhub-wall/themes/large');
var xlargeTheme = require('streamhub-wall/themes/xlarge');

/**
 * LiveMediaWall Component
 * It has a wall-view and a streamhub-input
 * @constructor
 * @param [opts] options
 * @param [opts.postButton=false] Whether to show a postButton or not, or what
 *     kind of postButton (see ./post-buttons)
 * @param [opts.el] {HTMLElement} The element to render in
 * @param [opts.collection] {streamhub-sdk/collection} The StreamHub Collection
 *     to show off in this wall and support uploads to (if auth integration)
 * @param [opts.headerView] {View} A view to use as the header above the wall,
 *     else a wall-header-view will be created for you
 * @param [opts.wallView] {View} A view to use as the main feature, else a
 *     wall-view will be created for you
 * @param [opts.initial] The initial number of items to show in the wall,
 *     if you don't provide your own opts.wallView
 * @param [opts.showMore] The number of items to add to the wall when 'show
 *     more' is clicked, if you don't provide your own opts.wallView
 * @param [opts.modal] A modal instance to use when items in the wall are clicked,
 *     or false if you want it disabled. Used if you don't provide opts.wallView
 * @param [opts.autoRender=true] Whether to automatically render on construction
 * @param [opts.insightsEmitter] A "new-able" Emitter class to use for sending events. If none
 *     is provided, a Insights Emitter will be used instead.
 */
var WallComponent = module.exports = function (opts) {
  AppBase.call(this, opts);
  // Be a writable that really just proxies to the wallView
  Passthrough.apply(this, arguments);

  // List of apps to render.
  this._toRender = [];
  this._initializeHeaderView(this.opts);
  this._initializeWallView(this.opts);

  // Configure the app.
  this.configure(this.opts);
};
inherits(WallComponent, Passthrough);
inherits.parasitically(WallComponent, AppBase);

/**
 * Map of theme size to theme object.
 * @enum {Object}
 */
var THEME_MAP = {
  xsmall: xsmallTheme,
  small: smallTheme,
  medium: mediumTheme,
  large: largeTheme,
  xlarge: xlargeTheme
};

/**
 * Element prefixes that we want to theme.
 * @type {Array.<string>}
 */
var THEMABLE_ELEMENTS = ['post', 'showMore'];

/**
 * Properties that will have colors generated for them.
 * @type {Object}
 */
var THEMABLE_STYLES = {
  dark: {
    activeBackgroundColor: {fn: 'blacken', amt: 5},
    activeBorderColor: {fn: 'blacken', amt: 20},
    activeTextColor: {color: '#fff'},
    backgroundColor: null,
    borderColor: {fn: 'blacken', amt: 15},
    hoverBackgroundColor: null,
    hoverBorderColor: null,
    hoverTextColor: {color: '#fff'},
    textColor: {color: '#fff'}
  },
  light: {
    activeBackgroundColor: {fn: 'lighten', amt: 5},
    activeBorderColor: {fn: 'lighten', amt: 20},
    activeTextColor: {color: '#000'},
    backgroundColor: null,
    borderColor: {fn: 'lighten', amt: 15},
    hoverBackgroundColor: null,
    hoverBorderColor: null,
    hoverTextColor: {color: '#000'},
    textColor: {color: '#000'}
  }
};

/** @override */
WallComponent.prototype.configureInternal = function (configOpts) {
  var reconstructWallView = false;
  var reconstructHeaderView = false;
  var newCollection;
  var needRender = false;
  var needCollectionPipeToWallView = false;

  if (this._themeChanged) {
    reconstructHeaderView = true;
  }

  if ('columns' in configOpts) {
    this.opts.columns = configOpts.columns;
    this._wallView.relayout({
      columns: configOpts.columns
    });
  }

  if ('initial' in configOpts) {
    this.opts.initial = configOpts.initial;
    newCollection = this._collection;
    reconstructWallView = true;
  }

  if ('modal' in configOpts) {
    this.opts.modal = configOpts.modal;
    newCollection = this._collection;
    reconstructWallView = true;
  }

  if ('collection' in configOpts) {
    newCollection = configOpts.collection;
    if (newCollection && !this._isSameCollection(newCollection)) {
      this._setCollection(newCollection);
      reconstructWallView = true;
      reconstructHeaderView = true;
    }
  }

  if ('postButton' in configOpts) {
    this.opts.postButton = configOpts.postButton;
    reconstructHeaderView = true;
  }

  if ('showTitle' in configOpts || 'mediaRequired' in configOpts) {
    this.opts.postConfig = this.opts.postConfig || {};
    if ('showTitle' in configOpts) {
      this.opts.postConfig.showTitle = configOpts.showTitle;
    }
    if ('mediaRequired' in configOpts) {
      this.opts.postConfig.mediaRequired = configOpts.mediaRequired;
    }
    reconstructHeaderView = true;
  }

  // translations changed, re-render
  if (configOpts.forceReconstruct) {
    reconstructHeaderView = true;
    reconstructWallView = true;
  }

  // block rendering without translations
  if (!this.canRender()) {
    needRender = false;
    reconstructHeaderView = false;
    reconstructWallView = false;
  }

  if (reconstructWallView) {
    this._wallView && this._wallView.destroy();
    this._initializeWallView(this.opts);
    needRender = true;
    needCollectionPipeToWallView = true;
    this._toRender.push(this._wallView);
    this._emitterProcessed = false;
  }

  if (reconstructHeaderView) {
    this._headerView && this._headerView.destroy();
    this._initializeHeaderView(this.opts);
    needRender = true;
    this._toRender.push(this._headerView);
  }

  if (needRender) {
    this.render();
  }

  if (needCollectionPipeToWallView && this._collection) {
    this._collection.pipe(this._wallView);
  }
};

/**
 * The entered view callback
 */
WallComponent.prototype.enteredView = function () {
  this._wallView.relayout();
};

WallComponent.prototype.delegateEvents = function () {};
WallComponent.prototype.undelegateEvents = function () {};

/**
 * Clean up things and null out references.
 */
WallComponent.prototype.destroy = function () {
  AppBase.prototype.destroy.call(this);
  this._headerView.destroy();
  this._headerView = null;
  this._wallView.destroy();
  this._wallView = null;
};

/** @override */
WallComponent.prototype.getPackageJson = function () {
  return packageJson;
};

/** @override */
WallComponent.prototype.getPrefix = function () {
  return 'lf-wall-uuid';
};

/** @override */
WallComponent.prototype.getThemableCss = function () {
  return themableCss;
};

/** @override */
WallComponent.prototype.getThemeOpts = function (opts) {
  opts = opts || {};

  var fontSize = opts.fontSize ? opts.fontSize.toLowerCase() : '';
  var fontSizeOpts = THEME_MAP[fontSize] || {};

  var theme = $.extend({}, this._themeOpts || {}, opts);
  theme = $.extend(theme, this.generateColors(THEMABLE_ELEMENTS, THEMABLE_STYLES, theme));

  return $.extend({}, opts, theme, fontSizeOpts);
};

/** @override */
WallComponent.prototype.handleEmitterReady = function () {
  var view = this._wallView;
  var self = this;

  // App loaded listener
  var cnt = 0;
  var checkGoalTimer = null;
  var checkGoal = function (content) {
    if (checkGoalTimer) {
      clearTimeout(checkGoalTimer);
    }

    // Check for existence of content first.. if it's empty, it means we came
    // from the timeout as opposed to the actual "add" trigger, and that means
    // we never met the goal because there is less content than the goal provided.
    if (content && ++cnt <= view.more.getGoal()) {
      // Save off the collectionId for later at this point because its not
      // available until we start adding content in.
      if (self._collection && self._collection.id) {
        self._emitter.setCollection(self._collection);
      }
      checkGoalTimer = setTimeout(checkGoal, 100);
      return;
    }

    view.removeListener('added', checkGoal);
    view.$el.trigger('insights:local', {type: ActivityTypes.LOAD});
  };
  view.on('added', checkGoal);

  // Show more listener
  if (view.showMoreButton && view.showMoreButton.$el) {
    view.showMoreButton.$el.on('showMore.hub', function () {
      view.$el.trigger('insights:local', {type: ActivityTypes.REQUEST_MORE});
    });
  }
};

/**
 * Create a WallHeaderView and assign to this._headerView.
 * @param opts {object} WallComponent configuration options.
 * @private
 */
WallComponent.prototype._initializeHeaderView = function (opts) {
  this._headerView = opts.headerView || new WallHeaderView({
    _i18n: opts._i18n,
    collection: opts.collection,
    forceButtonRender: opts.forceButtonRender,
    postButton: opts.postButton,
    postConfig: opts.postConfig || {},
    stylePrefix: this.generateStylePrefix(),
    themeOpts: this._themeOpts
  });
};

/**
 * Create a WallView and assign to this._wallView.
 * Also pipe this WallComponent's writable side and .more to the WallView's
 * @param opts {object} WallComponent configuration options.
 * @private
 */
WallComponent.prototype._initializeWallView = function (opts) {
  this._wallView = opts.wallView || new WallView({
    autoRender: false,
    collection: this._collection,
    columns: opts.columns,
    hideSocialBrandingWithRights: opts.hideSocialBrandingWithRights,
    initial: opts.initial,
    liker: opts.liker,
    minContentWidth: opts.minContentWidth,
    modal: opts.modal,
    pickColumn: opts.pickColumn,
    productOptions: opts.productOptions,
    sharer: opts.sharer,
    showMore: opts.showMore
  });

  this.pipe(this._wallView);
  // including more, so that Collection piping works right
  this.more = new Passthrough();
  this.more.pipe(this._wallView.more);
};

/** @override */
WallComponent.prototype.isViewRendered = function () {
  return this._wallView && this._wallView.el.parentElement;
};

/**
 * Render the WallComponent
 */
WallComponent.prototype.render = function () {
  AppBase.prototype.render.apply(this, arguments);

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

  // Only render the subviews that we want to render. `_toRender` has the
  // views that the `configure` function has determined should be rendered.
  subviews = this._toRender.length ? this._toRender : subviews;

  // then render them
  subviews.forEach(function (view) {
    view.render();
  });

  this._toRender = [];
  return el;
};

/**
 * Set internal state as to which collection should be shown in this wall.
 * This will not re-render or recreate subviews. That should be done separately.
 * @param {collection} The collection to set.
 */
WallComponent.prototype.setCollectionInternal = function (newCollection) {
  var oldCollection = this._collection;

  if (oldCollection && typeof oldCollection.unpipe === 'function') {
    oldCollection.unpipe(this._wallView);
  }

  AppBase.prototype.setCollectionInternal.call(this, newCollection);
};

/** @override */
WallComponent.prototype.unconfigureInternal = function () {
  AppBase.prototype.unconfigureInternal.call(this);

  if (this._wallView) {
    this.unpipe(this._wallView);
    this.more.unpipe(this._wallView.more);
    this.more = null;
  }
};
