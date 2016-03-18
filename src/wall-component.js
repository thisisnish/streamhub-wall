
require('less!streamhub-wall/styles/wall-component');

var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var View = require('view');
var WallView = require('./wall-view');
var WallHeaderView = require('./wall-header-view');
var Passthrough = require('stream/passthrough');
var packageAttribute = require('./package-attribute');
var ThemeStyler = require('livefyre-theme-styler');
var TSColors = require('livefyre-theme-styler/colors');
var smallTheme = require('streamhub-wall/themes/small');
var mediumTheme = require('streamhub-wall/themes/medium');
var largeTheme = require('streamhub-wall/themes/large');
var uuid = require('node-uuid');
var Collection = require('streamhub-sdk/collection');
var themableCss = require('text!streamhub-wall/styles/theme.css');
var InsightsEmitter = require('insights-emitter');
var ActivityTypes = require('activity-streams-vocabulary').ActivityTypes;
var fillIn = require('mout/object/fillIn');


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
  opts = this._opts = opts || {};

  this._uuid = uuid();
  this._stylePrefix = ['[lf-wall-uuid="',this._uuid,'"] '].join('');

  View.apply(this, arguments);

  // Be a writable that really just proxies to the wallView
  Passthrough.apply(this, arguments);

  if (opts.collection) {
    this._setCollection(opts.collection);
  }

  // set up translations
  this._configure_i18n(opts);

  // List of apps to render.
  this._toRender = [];
  this._themeOpts = this._getThemeOpts(opts);
  this._initializeHeaderView(opts);
  this._initializeWallView(opts);

  if ((!('autoRender' in opts)) || opts.autoRender) {
    this.render();
  }

  if (this._collection) {
    this._collection.pipe(this._wallView);
  }

  this._insightsEmitter = this._initializeInsightsEmitter(opts);
};

inherits(WallComponent, Passthrough);
inherits.parasitically(WallComponent, View);

var I18N_MAP = {
  postButtonText: ['POST', 'POST_PHOTO'],
  postModalTitle: ['POST_MODAL_TITLE'],
  postModalButton: ['POST_MODAL_BUTTON'],
  postModalPlaceholder: ['PLACEHOLDERTEXT']
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

/**
 * Apply the provided theme argument to the theme css via the theme styler.
 * @param {Object} theme The themes properties to add.
 * @private
 */
WallComponent.prototype._applyTheme = function (theme) {
  $.extend(this._opts, theme);

  this._themeStyler = this._themeStyler || new ThemeStyler({
    css: themableCss,
    prefix: this._stylePrefix
  });
  this._themeStyler.applyTheme(theme);
};

/**
 * Configure the theme options. Loops through all the themable elements and
 * generates colors for them. If the colors are already specified in the opts
 * argument, they will not be overridden.
 * @param {Object} opts The theme options to update.
 * @private
 */
function configureThemeOpts(opts) {
  var prefix;
  var styles;
  var _opts = {};

  if (!opts.linkColor) {
    return;
  }

  for (var i=0; i<THEMABLE_ELEMENTS.length; i++) {
    prefix = THEMABLE_ELEMENTS[i];
    styles = TSColors.generateColors(prefix, opts.linkColor, THEMABLE_STYLES);
    $.extend(_opts, styles);
  }
  return _opts;
}

/**
 * Get and configure the theme options for the app.
 * @param {Object} opts Config options to use/add to.
 * @return {Object} The theme options.
 * @private
 */
WallComponent.prototype._getThemeOpts = function (opts) {
  opts = opts || {};

  var fontSize = opts.fontSize ? opts.fontSize.toLowerCase() : '';
  var fontSizeOpts = {};
  var theme;

  if (fontSize === 'small') {
    fontSizeOpts = smallTheme;
  } else if (fontSize === 'medium') {
    fontSizeOpts = mediumTheme;
  } else if (fontSize === 'large') {
    fontSizeOpts = largeTheme;
  }

  theme = $.extend({}, this._themeOpts || {}, opts);
  theme = $.extend(theme, configureThemeOpts(theme));

  return $.extend({}, opts, theme, fontSizeOpts);
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
    stylePrefix: this._stylePrefix,
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
    minContentWidth: opts.minContentWidth,
    columns: opts.columns,
    initial: opts.initial,
    showMore: opts.showMore,
    modal: opts.modal,
    pickColumn: opts.pickColumn
  });

  this.pipe(this._wallView);
  // including more, so that Collection piping works right
  this.more = new Passthrough();
  this.more.pipe(this._wallView.more);
};

/**
 * Create and configure an insights emitter as well as attaching
 * events.
 * @private
 *
 * @param  {Object} opts Options
 * @return {?function()} Instance of Insights Emitter or a passed in emitter
 */
WallComponent.prototype._initializeInsightsEmitter = function (opts) {
  // We can't emit any meaningful stats without the collection
  // information, so if we don't have it, exit and wait until we do.
  if (!opts.collection) {
    return null;
  }

  var EmitterCls;
  var insightsEmitter = opts.insightsEmitter;
  var userEmitterOpts = {};

  // Have 4 cases that we have to consider:
  // 1. We want whatever's built-in, so no Insights Emitter has been passed in
  // 2. We want to use a different Insights Emitter Class, so we'll pass one in
  // 3. We want to use the stock Insights Emitter, but want to pass it options as an object
  // 4. We want to pass in a different Insighst Emitter Class with options
  if (!insightsEmitter) {
    EmitterCls = InsightsEmitter;
  } else if (typeof insightsEmitter === 'function') {
    EmitterCls = insightsEmitter;
  } else if (typeof insightsEmitter === 'object') {
    if (insightsEmitter.cls && typeof insightsEmitter.cls === 'function') {
      EmitterCls = insightsEmitter.cls;
      delete insightsEmitter.cls;
    }
    userEmitterOpts = insightsEmitter;
  }

  // If there's no EmitterCls at this point, it means that only options
  // were passed in and no class was specified (case #3), so let's
  // use the default emitter
  if (!EmitterCls) {
    EmitterCls = InsightsEmitter;
  }

  var emitterOpts = {
    appName: opts.appName,
    el: this.el,
    network: opts.collection.network,
    siteId: opts.collection.siteId,
    uuid: this._uuid,
    name: 'Media Wall',
    version: packageAttribute.value.split('#')[1],
    type: 'App'
  };

  if (opts.inDesigner || opts.inShare) {
    emitterOpts.disabled = true;
  }

  // Merge options; emitterOpts takes precedence
  fillIn(emitterOpts, userEmitterOpts);

  var emitter = new EmitterCls(emitterOpts);
  emitter.send({
    type: ActivityTypes.INIT
  });

  // Things after this point rely on there being a wall view to attach
  // to, so let's make sure that a wall view exist.. if not exit early.
  if (!this._wallView) {
    return emitter;
  }

  var view = this._wallView;
  var self = this;

  // App loaded listener
  var cnt = 0;
  var checkGoalTimer = null;
  var checkGoal = function (content) {
    if (checkGoalTimer) {
      clearTimeout(checkGoalTimer);
    }

    // Check for existence of content first.. if it's empty,
    // it means we came from the timeout as opposed to the
    // actual "add" trigger, and that means we never met the
    // goal because there is less content than the goal
    // provided.
    if (content && ++cnt <= view.more.getGoal()) {
      // Save off the collectionId for later at this point because
      // its not available until we start adding content in
      if (!self.collectionId && self._collection.id) {
        emitter.collectionId = self._collection.id;
      }
      checkGoalTimer = setTimeout(checkGoal.bind(this, null), 100);

      return;
    }

    view.removeListener('added', checkGoal);
    emitter.send({
      type: ActivityTypes.LOAD
    });
  };
  view.on('added', checkGoal);

  // Show more listener
  if (view.showMoreButton && view.showMoreButton.$el) {
    view.showMoreButton.$el.on('showMore.hub', function () {
      emitter.send({
        type: ActivityTypes.REQUEST_MORE
      });
    });
  }

  // Modal listener
  if (view.modal) {
    view.$el.on('focusContent.hub', function (evt, data) {
      var evtData = {
        type: ActivityTypes.MODAL_LOAD
      };
      if (data && data.content) {
        evtData.content = data.content;
      }

      emitter.send(evtData);
    });
  }

  return emitter;
};

/**
 * Given a Collection, return whether it is the same Collection as this
 * WallComponent is currently using
 * @param {Object|Collection} collection Collection to compare to.
 * @private
 */
WallComponent.prototype._isSameCollection = function (collection) {
  var oldCollection = this._collection;
  return oldCollection && collection
        && oldCollection.network === collection.network
        && oldCollection.environment === collection.environment
        && oldCollection.siteId === collection.siteId
        && oldCollection.articleId === collection.articleId;
};

/**
 * Remove any current theme configuration for this Component, returning
 * it to default styles.
 * @private
 */
WallComponent.prototype._removeTheme = function () {
  this._themeStyler.destroy();
};

/**
 * Set internal state as to which collection should be shown in this wall.
 * This will not re-render or recreate subviews. That should be done separately.
 * @param {collection} The collection to set.
 * @private
 */
WallComponent.prototype._setCollection = function (newCollection) {
  var oldCollection = this._collection;

  if (oldCollection && typeof oldCollection.unpipe === 'function') {
    oldCollection.unpipe(this._wallView);
  }

  // If this is not a full streamhub-sdk newCollection object, then make
  // it one
  if (newCollection && typeof newCollection.pipe !== 'function') {
    newCollection = new Collection(newCollection);
  }

  // Actually set internal state
  this._collection = newCollection;
  this._opts.collection = newCollection;
};

/**
 * configure i18n translations
 * @param configOpts {collection} WallComponent configuration object
 * @private
 */
WallComponent.prototype._configure_i18n = function (configOpts) {
  var changed = false;
  var self = this;
  this._opts._i18n = this._opts._i18n || {};

  $.each(I18N_MAP, function (key, value) {
    if (key in configOpts) {
      for (var i = 0; i < value.length; i++) {
        if (!configOpts[key] || configOpts[key].length === 0) {
          delete self._opts._i18n[value[i]];
        } else {
          self._opts._i18n[value[i]] = configOpts[key];
        }
      }
      changed = true;
    }
  });

  return changed;
};

/**
 * Restore configuration values back to defaults
 * @private
 */
WallComponent.prototype._unconfigure = function () {
  this._removeTheme();
  this.configure({
    collection: null
  });
};

/**
 * Change configuration after construction
 * @param configOpts {collection} WallComponent configuration object
 */
WallComponent.prototype.configure = function (configOpts) {
  var reconstructWallView = false;
  var reconstructHeaderView = false;
  var newCollection;
  var needRender = false;
  var needCollectionPipeToWallView = false;

  if (!configOpts) {
    this._unconfigure();
    return;
  }

  if (configOpts.linkColor !== this._themeOpts.linkColor) {
    reconstructHeaderView = true;
  }

  this._themeOpts = this._getThemeOpts(configOpts);
  this._applyTheme(this._themeOpts);

  if ('columns' in configOpts) {
    this._opts.columns = configOpts.columns;
    this._wallView.relayout({
      columns: configOpts.columns
    });
  }
  if ('initial' in configOpts) {
    this._opts.initial = configOpts.initial;
    newCollection = this._collection;
    reconstructWallView = true;
  }
  if ('modal' in configOpts) {
    this._opts.modal = configOpts.modal;
    newCollection = this._collection;
    reconstructWallView = true;
  }
  if ('collection' in configOpts) {
    newCollection = configOpts.collection;
    if (!this._isSameCollection(newCollection)) {
      this._setCollection(newCollection);
      reconstructWallView = true;
      reconstructHeaderView = true;
    }
  }
  if ('postButton' in configOpts) {
    this._opts.postButton = configOpts.postButton;
    reconstructHeaderView = true;
  }
  if ('showTitle' in configOpts || 'mediaRequired' in configOpts) {
    this._opts.postConfig = this._opts.postConfig || {};
    if ('showTitle' in configOpts) {
      this._opts.postConfig.showTitle = configOpts.showTitle;
    }
    if ('mediaRequired' in configOpts) {
      this._opts.postConfig.mediaRequired = configOpts.mediaRequired;
    }
    reconstructHeaderView = true;
  }

  // translations
  if (this._configure_i18n(configOpts)) {
    reconstructHeaderView = true;
  }

  if (reconstructWallView) {
    this._wallView.destroy();
    this._initializeWallView(this._opts);
    needRender = true;
    needCollectionPipeToWallView = true;
    this._toRender.push(this._wallView);
  }
  if (reconstructHeaderView) {
    this._headerView.destroy();
    this._initializeHeaderView(this._opts);
    needRender = true;
    this._toRender.push(this._headerView);
  }
  if (needRender) {
    this.render();
  }
  if (needCollectionPipeToWallView && this._collection) {
    this._collection.pipe(this._wallView);
  }
  if ('collection' in configOpts && !this._insightsEmitter) {
    this._initializeInsightsEmitter(configOpts);
  }
};

/**
 * The entered view callback
 */
WallComponent.prototype.enteredView = function () {
  this._wallView.relayout();
};

/**
 * Render the WallComponent
 */
WallComponent.prototype.render = function () {
  View.prototype.render.apply(this, arguments);

  if (this._themeOpts) {
    this._applyTheme(this._themeOpts);
  }

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
 * Public interface to change the Collection currently being rendered by this
 * WallComponent
 * @param collection {object|Collection} Collection to compare to.
 */
WallComponent.prototype.setCollection = function (newCollection) {
  this.configure({collection: newCollection});
};

/**
 * Set the HTMLElement that this View renders in
 * @override
 * @param el {HTMLElement}
 */
WallComponent.prototype.setElement = function (el) {
  if (this.el) {
    packageAttribute.undecorate(this.el);
  }
  View.prototype.setElement.apply(this, arguments);
  packageAttribute.decorate(this.el);
  this.el.setAttribute('lf-wall-uuid', this._uuid);
};

/**
 * Clean up things and null out references.
 */
WallComponent.prototype.destroy = function () {
  View.prototype.destroy.call(this);
  this._headerView.destroy();
  this._headerView = null;
  this._insightsEmitter.destroy();
  this._insightsEmitter = null;
  this._themeStyler.destroy();
  this._themeStyler = null;
  this._wallView.destroy();
  this._wallView = null;
};