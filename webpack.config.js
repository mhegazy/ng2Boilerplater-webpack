// Helper: root(), and rootDir() are defined at the bottom
var path = require('path');
var webpack = require('webpack');
var args = process.argv.slice(2);

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (function makeWebpackConfig() {
    /**
     * Environment type
     * BUILD is for generating minified builds
     */
    var BUILD = args.indexOf('--webpack-build') !== -1 || process.env['webpack-build'];
    var TEST = args.indexOf('--webpack-test') !== -1 || process.env['webpack-test'];

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    // add debug messages
    config.debug = !BUILD || !TEST;

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = TEST ? {} : {
        'vendor': './src/vendor.ts',
        'app': './src/bootstrap.ts' // our angular app
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = TEST ? {} : {
        path: root('dist'),
        publicPath: './',
        filename: 'js/[name].js',
        chunkFilename: BUILD ? '[id].chunk.js?[hash]' : '[id].chunk.js'
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        cache: !TEST,
        root: root(),
        // only discover files that have those extensions
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'src/app',
            'common': 'src/common'
        }
    };

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        preLoaders: TEST ? [] : [{test: /\.ts$/, loader: 'tslint'}],
        loaders: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loader: 'ts',
                query: {
                    'ignoreDiagnostics': [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375  // 2375 -> Duplicate string index signature
                    ]
                },
                exclude: [TEST ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
            },

            // copy those assets to output
            {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=[path][name].[ext]?[hash]'},

            // Support for *.json files.
            {test: /\.json$/, loader: 'json'},

            // Support for CSS as raw text
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {test: /\.css$/, exclude: root('src','app'), loader: TEST ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')},
            // all css required in src/app files will be merged in js files
            {test: /\.css$/, exclude: root('src', 'style'), loader: 'raw!postcss'},

            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {test: /\.scss$/, exclude: root('src', 'app'), loader: TEST ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')},
            // all css required in src/app files will be merged in js files
            {test: /\.scss$/, exclude: root('src', 'style'), loader: 'raw!postcss!sass'},

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {test: /\.html$/, loader: 'raw'}
        ],
        postLoaders: [],
        noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
    };

    //if (TEST) {
    //    // instrument only testing sources with Istanbul, covers js compiled files for now :-/
    //    config.module.postLoaders.push({
    //        test: /\.(js|ts)$/,
    //        include: path.resolve('src'),
    //        loader: 'istanbul-instrumenter-loader',
    //        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    //    })
    //}

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [];


    if(!TEST) {
        config.plugins.push(
            // Generate common chunks if necessary
            // Reference: https://webpack.github.io/docs/code-splitting.html
            // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
            new CommonsChunkPlugin({
                name: 'vendor',
                filename: 'js/[name].js',
                minChunks: Infinity
            }),
            new CommonsChunkPlugin({
                name: 'common',
                filename: 'js/[name].js',
                minChunks: 2,
                chunks: ['app', 'vendor']
            }),

            // Inject paths into html files
            // Reference: https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                template: './src/public/index.html',
                inject: 'body',
                hash: true, // inject ?hash at the end of the files
                chunksSortMode: function compare(a, b) {
                    // common always first
                    if(a.names[0] === 'common') {
                        return -1;
                    }
                    // app always last
                    if(a.names[0] === 'app') {
                        return 1;
                    }
                    // vendor before app
                    if(a.names[0] === 'vendor' && b.names[0] === 'app') {
                        return -1;
                    } else {
                        return 1;
                    }
                    // a must be equal to b
                    return 0;
                }
            }),

            // Extract css files
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin('css/[name].css', {disable: !BUILD || TEST})
        );
    }

    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
            // Assign the module and chunk ids by occurrence count.
            new webpack.optimize.OccurenceOrderPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            //new webpack.optimize.UglifyJsPlugin({
            //    // disabled for beta.1 because it was breaking the build, todo: remove this once fixed
            //    // reference: https://github.com/angular/angular/issues/6366
            //    // reference: https://github.com/angular/angular/issues/6380
            //    mangle: false
            //}),

            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
                from: root('src/public')
            }])
        );
    }

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Sass
     * Reference: https://github.com/jtangelder/sass-loader
     * Transforms .scss files to .css
     */
    config.sassLoader = {
        //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
    };

    /**
     * Apply the tslint loader as pre/postLoader
     * Reference: https://github.com/wbuchwalter/tslint-loader
     */
    config.tslint = {
        emitErrors: false,
        failOnHint: false
    };

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        historyApiFallback: true,
        contentBase: './src/public'
    };

    return config;
})();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return root.apply(path, ['node_modules'].concat(args));
}
