var rework = require('rework');

/**
 * Prefix every rule in the in css string
 * with an attribute selector that targets only
 * elements in Components created from THIS version
 * of the module
 */
module.exports = function (css, params) {
    var prefix = params.prefix;
    if ( ! prefix) {
        return css;
    }
    console.log('prefixing css');
    var prefixedCss = rework(css)
        .use(rework.prefixSelectors(prefix))
        .toString();
    return prefixedCss;
};
