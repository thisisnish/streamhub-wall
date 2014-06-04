// The main export is a View constructor for the full app
exports = module.exports = require('./wall-component');

// Just a view that makes a wall, no upload button or wall-header-view
exports.WallView = require('./wall-view');
