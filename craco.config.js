/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    configure(webpackConfig) {
      // console.log('config', webpackConfig.module.rules);

      const rules = webpackConfig.module.rules;

      rules.push({
        test: /\.tsx$/,
        loader: path.resolve(__dirname, './loaders/BundleRoute.js'),
        options: {
          paths: path.resolve(__dirname, './src/pages')
        }
      });

      return webpackConfig;
    }
  }
};
