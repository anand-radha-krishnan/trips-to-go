const path = require('path');

module.exports = {
  entry: './public/js/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/js'),
  },
};
