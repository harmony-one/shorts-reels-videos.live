const paths = require('./paths');

const appPackageJson = require(paths.appPackageJson);

const ModuleFederationPlugin = require('webpack').container
  .ModuleFederationPlugin;

function getSharedModulesConfig() {
  const SINGLETON_MODULES = [
    // 'react',
    // 'react-dom',
    // 'react-router',
    // 'react-router-dom',
    // 'styled-components',
  ];

  const configEntries = SINGLETON_MODULES.map(lib => [
    lib,
    {
      singleton: true,
      requiredVersion: appPackageJson.dependencies[lib],
    },
  ]);

  return Object.fromEntries(configEntries);
}

module.exports = new ModuleFederationPlugin({
  name: 'live',
  library: {
    name: 'live',
    type: 'global',
  },
  filename: 'exports.js',
  remotes: {
    shared: 'shared@/shared.js',
  },
  remoteType: 'script',
  exposes: {
    './App': './src/index',
  },
  shared: getSharedModulesConfig(),
});
