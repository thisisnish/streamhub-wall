var camelCase = require('mout/string/camelCase');
var ContentEditorButton = require('streamhub-input').ContentEditorButton;
var forEach = require('mout/array/forEach');
var inherits = require('inherits');
var ModalView = require('streamhub-sdk/modal');
var packageAttribute = require('./package-attribute');
var postButtons = require('streamhub-wall/post-buttons');
var UploadButton = require('streamhub-input').UploadButton;
var View = require('view');

/**
 * Header of LiveMediaWall.
 * It has a streamhub-input button iff auth.hasDelegate();
 * @constructor
 * @param {Object} opts
 */
var WallHeaderView = module.exports = function (opts) {
  View.apply(this, arguments);
  opts = this.opts = opts || {};

  /**
   * Whether the button should be forced to render or not.
   * @type {boolean}
   * @private
   */
  this._forceButtonRender = !!opts.forceButtonRender;

  /**
   * The post button.
   * @type {?InputButton}
   * @private
   */
  this._postButton = opts.postButton ? this._createPostButton(opts.postButton) : null;

  /**
   * @type {boolean}
   * @private
   */
  this._rendered = false;

  if (opts.collection) {
    this.setCollection(opts.collection);
  }
};

inherits(WallHeaderView, View);

WallHeaderView.prototype.elTag = 'menu';

WallHeaderView.prototype.template = function () { return ''; };

/**
 * Render the WallHeaderView
 */
WallHeaderView.prototype.render = function () {
  View.prototype.render.apply(this, arguments);
  if (!this._postButton) {
    return;
  }
    // FIXME: I shouldn't be reaching into private state to get cmd
  var postCommand = this._postButton._command;
  if (this._forceButtonRender || postCommand.canExecute()) {
    renderPostButtonIfCollection.call(this, true);
  } else {
    postCommand.on('change:canExecute', renderPostButtonIfCollection.bind(this));
  }
  this._rendered = true;
  function renderPostButtonIfCollection(showPostButton) {
    if (!this._collection) {
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
  if (this._collection && this._postButton) {
    postButton.unpipe(this._collection);
  }
  this._collection = collection;
  if (this._postButton && collection) {
    postButton.pipe(collection);
  }
  if (this._rendered) {
    this.render();
  }
};

/**
 * Button style attribute names that are sent through to the button.
 * @type {Array.<string>}
 */
var BUTTON_STYLES = [
  'activeBackgroundColor',
  'activeBorderColor',
  'activeTextColor',
  'backgroundColor',
  'borderColor',
  'hoverBackgroundColor',
  'hoverBorderColor',
  'hoverTextColor',
  'textColor'
];

/**
 * Get the editor button styles into a format that the button expects.
 * @param {Object} opts The object that contains the button styles.
 * @return {Object} The adapted button styles.
 */
function getEditorButtonStyles(opts) {
  var prefixedName;
  var styles = {};

  if (!opts) {
    return {};
  }

  forEach(BUTTON_STYLES, function (name) {
    prefixedName = camelCase('post-' + name);
    if (!opts[prefixedName]) {
      return;
    }
    styles[name] = opts[prefixedName];
  });
  return styles;
}

/**
 * Accepted mimetypes
 * @type {Object<string, Array>}
 */
WallHeaderView.mimetypes = {
  audio: [],
  photo: ['image/*'],
  video: ['video/avi', 'video/mp4', 'video/x-ms-wmv', 'video/x-ms-asf', 'video/x-msvideo',
    'video/mpeg', 'video/quicktime', 'video/x-qtc', 'video/x-dv', 'video/x-m4v',
    'video/3gpp', 'video/3gpp2', 'video/webm', 'video/ogg']
};

/**
 * Create the Button that will let the user post content into the
 * right Collection
 * @param kind - 'content', 'contentWithPhotos', 'contentWithVideos', 'video', 'photo', true, or falsy
 */
WallHeaderView.prototype._createPostButton = function (kind) {
  var button;
  var self = this;
  var audioMimeTypes = WallHeaderView.mimetypes.audio;
  var photoMimeTypes = WallHeaderView.mimetypes.photo;
  var videoMimeTypes = WallHeaderView.mimetypes.video;
  var postConfig = this.opts.postConfig || {};
  postConfig.maxAttachmentsPerPost = postConfig.maxAttachmentsPerPost || 1;

  function makeUploadButton(opts, mimetypes) {
    return new UploadButton({
      _i18n: self.opts._i18n,
      modal: createModal(),
      stylePrefix: opts.stylePrefix,
      styles: getEditorButtonStyles(opts.themeOpts),
      mimetypes: mimetypes
    });
  }

  if (kind === true) {
    return createEditorButton(true, photoMimeTypes);
  }

  var mimeTypes = [];
  ['audio', 'photo', 'video'].forEach(function (media) {
    if (kind.toLowerCase().indexOf(media) > -1) {
      mimeTypes = mimeTypes.concat(MIMETYPES[media]);
    }
  });

  if (kind.indexOf('content') > -1) {
    return createEditorButton(!!mimeTypes.length, mimeTypes);
  }
  if (mimeTypes.length) {
    return makeUploadButton(this.opts, mimeTypes);
  }

  // Create a Modal that will add the streamhub-wall#vN attribute
  // to its parent when it is shown, so that our css rules can be namespaced
  // nicely
  function createModal() {
    var modal = new ModalView();
    packageAttribute.decorateModal(modal);
    return modal;
  }

  // Create an editor button with or without media enabled. This also grabs
  // theme options from the opts object provided to this class so the button
  // can be styled appropriately.
  // @param {boolean} mediaEnabled
  // @param {Object} uploadOpts
  // @param {Array<string>=} mimetypes Optional array of mimetypes
  function createEditorButton(mediaEnabled, mimetypes) {
    return new ContentEditorButton({
      _i18n: self.opts._i18n,
      mediaEnabled: mediaEnabled,
      modal: createModal(),
      input: createInput(mediaEnabled, mimetypes, self.opts._i18n),
      stylePrefix: self.opts.stylePrefix,
      styles: getEditorButtonStyles(self.opts.themeOpts),
      mimetypes: mimetypes,
      maxAttachmentsPerPost: postConfig.maxAttachmentsPerPost,
      showTitle: postConfig.showTitle,
      mediaRequired: postConfig.mediaRequired
    });
  }

  // Create a custom ContentEditor input whose UploadButton will launch
  // a modal that has the right packageAttribute on its parent
  // @param {boolean} mediaEnabled
  // @param {Array<string>=} mimetypes Optional array of mimetypes
  function createInput(mediaEnabled, mimetypes, _i18n) {
    var input = ContentEditorButton.prototype.createInput.call(this, {
      _i18n: _i18n,
      mediaEnabled: mediaEnabled,
      mimetypes: mimetypes,
      showTitle: postConfig.showTitle,
      maxAttachmentsPerPost: postConfig.maxAttachmentsPerPost,
      mediaRequired: postConfig.mediaRequired
    });

    // patch .createUploadButton to create one that uses a modal
    // with streamhub-wall packageAttribute
    var ogCreateUploadButton = input.createUploadButton;
    input.createUploadButton = function (opts) {
      opts = opts || {
        mimetypes: mimetypes,
        showTitle: postConfig.showTitle,
        maxAttachmentsPerPost: postConfig.maxAttachmentsPerPost,
        mediaRequired: postConfig.mediaRequired
      };
      opts.modal = createModal();
      var uploadButton = ogCreateUploadButton.call(this, opts);
      return uploadButton;
    };
    return input;
  }
  return button;
};
