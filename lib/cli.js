#!/usr/bin/env node --harmony

'use strict';
require('colorful').toxic()

const program = require('commander');
const spawn = require('child_process').spawn;
const getWebpackConfig = require('./getWebpackConfig');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const execSync = require('child_process').execSync; 

function printResult(stats) {
  stats = stats.toJson();

  (stats.errors || []).forEach(function (err) {
    console.error('error'.red, err.red);
  });

  stats.assets.forEach(function (item) {
    var size = (item.size / 1024.0).toFixed(2) + 'kB';
    console.log('generated', item.name, size);
  });
}

program
  .command('compile')
  .description('build with babel')
  .option("-s, --src [src]", "source folder")
  .option("-d, --dest [dest]", "dest folder")
  .action(function(options){
    const src = options.src || "src";
    const dest = options.dest || "build";
    execSync('rm -rf ' + dest);
    console.log('compile ' + src + ' to ' + dest);
    spawn('babel', [src, '--out-dir', dest, '--presets', ['babel-preset-es2015','babel-preset-react','babel-preset-stage-0'].map(require.resolve).join(','), '--plugins', require.resolve('babel-plugin-transform-object-assign')], { stdio: 'inherit'});
  });

program
  .command('build')
  .description('build simples')
  .option("-s, --src [src]", "source folder")
  .option("-d, --dest [dest]", "build folder")
  .action(function(options){
    const src = options.src || "simples";
    const dest = options.dest || "build";
    execSync('rm -rf ' + dest);
    const config = getWebpackConfig(src, dest);
    console.log('webpack config:', config);
    const compiler = webpack(config);
    compiler.run((err, status) => {
      if (err) {
        paint(err).red.color;
        console.error(err);
      } else {
        printResult(status);
      }
    });

  })

program
  .command('dev')
  .description('dev server')
  .option("-s, --src [src]", "source folder")
  .option("-d, --dest [dest]", "build folder")
  .action(function(options){
    const src = options.src || "simples";
    const dest = options.dest || "build";
    execSync('rm -rf ' + dest);
    const config = getWebpackConfig(src, dest);
    Object.keys(config.entry).forEach((key) => {
      config.entry[key].unshift(require.resolve('webpack-dev-server/client') + '?http://localhost:8080', require.resolve('webpack/hot/dev-server'))
    });
    config.debug = true;
    config.devtool = 'eval-cheap-module-source-map';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    new WebpackDevServer(webpack(config), {
      contentBase: config.output.path,
      hot: true,
      historyApiFallback: true,
      stats: {
        colors: true
      }
    }).listen(8080, 'localhost', (err) => {
      if (err) {
        console.error(err.red.color);
      }
    });
  })

// program
//   .command('*')
//   .action(function(env){
//     console.log('deploying "%s"', env);
//   });

program.parse(process.argv);

