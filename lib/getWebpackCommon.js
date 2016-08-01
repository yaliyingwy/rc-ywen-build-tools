var path = require('path');
var cwd = process.cwd();
var pkg = require(path.join(cwd, 'package.json'));
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getResolve() {
  var alias = {};
  var resolve = {
    root: cwd,
    extensions: ['', '.js', '.jsx'],
    alias: alias,
  };
  var name = pkg.name;
  alias[name + '$'] = path.join(cwd, 'index.js');
  alias[name] = cwd;
  return resolve;
}
const babelQuery = {
  presets: ['babel-preset-es2015', 'babel-preset-react', 'babel-preset-stage-0'].map(require.resolve),
  plugins: ['babel-plugin-add-module-exports', 'babel-plugin-transform-object-assign'].map(require.resolve)
};

module.exports = {
  getResolve: getResolve,
  getResolveLoader: function () {
    return {
      root: path.join(__dirname, '../node_modules'),
    };
  },
  getLoaders: function () {
    return [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelQuery,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelQuery,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
      // loads bootstrap's css.
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/svg+xml',
      },
      { 
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'url?limit=10000!img?progressive=true'
      },
    ];
  },
  getCssLoaders: function (extractCss) {
    var cssLoader = ('css?sourceMap!autoprefixer-loader');
    var lessLoader = ('css?sourceMap!autoprefixer-loader!less?sourceMap');
    if (extractCss) {
      cssLoader = ExtractTextPlugin.extract(cssLoader);
      lessLoader = ExtractTextPlugin.extract(lessLoader);
    } else {
      cssLoader = 'style!' + cssLoader;
      lessLoader = 'style!' + lessLoader;
    }
    return [
      {
        test: /\.css$/,
        loader: cssLoader,
      },
      {
        test: /\.less$/,
        loader: lessLoader,
      },
    ];
  },
};
