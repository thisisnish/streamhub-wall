var livefyrePackageAttribute = require('livefyre-package-attribute');
var packageJson = require('json!streamhub-wall/../package.json');

module.exports = livefyrePackageAttribute(packageJson);
