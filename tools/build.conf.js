({
  mainConfigFile: '../requirejs.conf.js',
  paths: {
    jquery: 'lib/jquery/jquery.min',
    almond: 'lib/almond/almond',
    auth: 'lib/streamhub-sdk/tools/auth-stub'
  },
  baseUrl: '..',
  name: "streamhub-wall",
  include: [
    'almond'
  ],
  stubModules: ['text', 'hgn', 'json'],
  out: "../dist/streamhub-wall.min.js",
  separateCSS: true,
  pragmasOnSave: {
    excludeHogan: true,
    excludeRequireCss: true
  },
  cjsTranslate: true,
  optimize: "none",
  preserveLicenseComments: false,
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true,
  onBuildRead: function(moduleName, path, contents) {
    switch (moduleName) {
      case "jquery":
        contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})
