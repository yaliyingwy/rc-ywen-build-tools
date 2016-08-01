var path = require('path');
var cwd = process.cwd();
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var getWebpackCommon = require('./getWebpackCommon');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function getEntry(src) {
  var files = fs.readdirSync(src);
  var entry = {};
  files.forEach(function (file) {
    var extname = path.extname(file);
    var name = path.basename(file, extname);
    if (extname === '.js' || extname === '.jsx') {
      entry[name] = [src + '/' + file];
    }
  });
  return entry;
}

function getPlugins(entries) {
  const plugins = [];
  const keys = Object.keys(entries);
  for (var i = 0; i < keys.length; i++) {
    var entry = keys[i];
    plugins.push(new HtmlWebpackPlugin({
      inject: true,
      minify: false,
      title: entry,
      hash: true,
      filename: entry + '.html',
      chunks: ['common', entry],
      template: __dirname + '/tpl.html',
    }));
  }

  plugins.push(new ExtractTextPlugin('[name].css', {
    disable: false,
    allChunks: true,
  }));

  plugins.push(new webpack.optimize.CommonsChunkPlugin('common', 'common.js'));
  return plugins;
}


module.exports = function (src, dest) {
  const entries = getEntry(src);
  const plugins = getPlugins(entries);
  return {
    devtool: '#source-map',

    resolveLoader: getWebpackCommon.getResolveLoader(),

    entry: entries,

    output: {
      path: path.join(cwd, dest),
      // publicPath: './',
      filename: '[name].js',
    },

    module: {
      loaders: getWebpackCommon.getLoaders().concat(getWebpackCommon.getCssLoaders(true)),
    },

    resolve: getWebpackCommon.getResolve(),

    plugins: plugins,
  };
};
