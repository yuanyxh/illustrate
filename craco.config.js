/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const { loaderByName, getLoader, addBeforeLoader } = require('@craco/craco');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    configure(webpackConfig) {
      const { isFound } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );

      if (isFound) {
        addBeforeLoader(webpackConfig, loaderByName('source-map-loader'), {
          test: /\.worker\.(js|jsx|ts|tsx)$/,
          loader: 'worker-loader',
          options: {
            filename: '[name].[contenthash].worker.js'
          }
        });
      }

      return webpackConfig;
    }
  }
};
