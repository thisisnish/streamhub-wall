require.config({
  paths: {
    base64: 'lib/base64/base64',
    debug: 'lib/debug/debug',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    inherits: 'lib/inherits/inherits',
    jasmine: 'tests/jasmine',
    jasmineRequire: 'node_modules/jasmine-core/lib/jasmine-core/jasmine',
    'jasmine-html': 'node_modules/jasmine-core/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'node_modules/jasmine-jquery/lib/jasmine-jquery',
    jquery: 'lib/jquery/jquery',
    'js-truncate-html': 'lib/js-truncate-html/src/js-truncate-html',
    json: 'lib/requirejs-plugins/src/json',
    'livefyre-package-attribute': 'node_modules/livefyre-package-attribute/src/main',
    mout: 'lib/mout/src',
    observer: 'lib/observer/src/observer',
    rework: 'lib/rework/rework',
    text: 'lib/requirejs-text/text',
    'tinycolor': 'lib/tinycolor/tinycolor',
    urnlib: 'lib/urnlib.js/index',
    uuid: 'lib/pure-uuid/uuid'
  },
  packages: [{
    name: 'streamhub-wall',
    location: './src'
  },{
    name: 'app-base',
    location: 'lib/app-base/src'
  },{
    name: 'streamhub-sdk',
    location: 'lib/streamhub-sdk/src'
  },{
    name: 'streamhub-sdk/modal',
    location: 'lib/streamhub-sdk/src/modal'
  },{
    name: 'streamhub-sdk/collection',
    location: 'lib/streamhub-sdk/src/collection'
  },{
    name: 'streamhub-sdk/auth',
    location: 'lib/streamhub-sdk/src/auth'
  },{
    name: 'streamhub-sdk/content',
    location: 'lib/streamhub-sdk/src/content'
  },{
    name: 'streamhub-sdk/i18n',
    location: 'lib/streamhub-sdk/src',
    main: 'i18n'
  },{
    name: 'streamhub-sdk-tests',
    location: 'lib/streamhub-sdk/tests'
  },{
    name: 'stream',
    location: 'lib/stream/src'
  },{
    name: 'view',
    location: 'lib/view/src',
    main: 'view'
  },{
    name: 'auth',
    location: 'lib/auth/src'
  },{
    name: 'livefyre-auth',
    location: 'lib/livefyre-auth/src'
  },{
    name: 'streamhub-input',
    location: 'lib/streamhub-input/src',
    main: 'javascript/main'
  },{
    name: 'streamhub-editor',
    location: 'lib/streamhub-editor/src/javascript'
  },{
    name: 'streamhub-editor/templates',
    location: 'lib/streamhub-editor/src/templates'
  },{
    name: 'streamhub-editor/styles',
    location: 'lib/streamhub-editor/src/styles'
  },{
    name: 'livefyre-theme-styler',
    location: 'lib/livefyre-theme-styler/src'
  },{
    name: 'css',
    location: 'lib/require-css',
    main: 'css'
  },{
    name: 'less',
    location: 'lib/require-less',
    main: 'less'
  },{
    name: 'streamhub-share',
    location: 'lib/streamhub-share/src',
    main: 'share-button.js'
  },{
    name: 'streamhub-ui',
    location: 'lib/streamhub-ui/src'
  },{
    name: 'livefyre-bootstrap',
    location: 'lib/livefyre-bootstrap/src'
  },{
    name: 'activity-streams-vocabulary',
    location: 'lib/activity-streams-vocabulary/src',
    main: 'index'
  },{
    name: 'insights-emitter',
    location: 'lib/insights-emitter',
    main: 'insights-emitter'
  }],
  shim: {
    jquery: {
      exports: '$'
    },
    jasmineRequire: {
      exports: ['jasmineRequire']
    },
    'jasmine-html': {
      deps: ['jasmine']
    },
    'jasmine-jquery': {
      deps: ['jquery', 'jasmine']
    },
    rework: {
      exports: 'rework'
    }
  },
  css: {
    clearFileEachBuild: 'dist/streamhub-wall.min.css',
    transformEach: {
      requirejs: 'node_modules/livefyre-package-attribute/tools/prefix-css-requirejs',
      node: 'node_modules/livefyre-package-attribute/tools/prefix-css-node'
    }
  },
  less: {
    browserLoad: 'dist/streamhub-wall.min',
    paths: ['lib'],
    relativeUrls: true,
    modifyVars: {
      '@icon-font-path': '"https://cdn.livefyre.com/libs/livefyre-bootstrap/v1.5.5/fonts/"'
    }
  }
});
