const pluginPkg = require('../../package.json');
const pluginId = pluginPkg.strapi.name.replace(
  /^strapi-plugin-/i,
  ''
);

module.exports = pluginId;
