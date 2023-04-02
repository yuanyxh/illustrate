// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line no-undef
module.exports = {
  webpack: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src')
    }
  }
};
