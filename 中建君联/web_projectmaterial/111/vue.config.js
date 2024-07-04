const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const Timestamp = new Date().getTime();

module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: true, // eslint-loader 是否在保存的时候检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: (config) => {
    Object.assign(config, {

      // 开发生产共同配置
    });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production';
      config.output.filename = `js/[name].${Timestamp}.js`;
      config.output.chunkFilename = `js/[name].${Timestamp}.js`;
      // 将每个依赖包打包成单独的js文件
      const optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          name: true, // 缓存组里面的filename生效，覆盖默认命名
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              }
            }
          }
        },
        minimizer: [
          new TerserPlugin({
            sourceMap: false,
            terserOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ]
      };
      Object.assign(config, {
        optimization
      });
    } else {
      // 为开发环境修改配置...
      config.mode = 'development';
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@': path.resolve(__dirname, './src'),
          'api': path.resolve(__dirname, './src/api'),
          'router': path.resolve(__dirname, './src/router'),
          'store': path.resolve(__dirname, './src/store'),
          'views': path.resolve(__dirname, './src/views'),
          'components': path.resolve(__dirname, './src/components'),
          'filters': path.resolve(__dirname, './src/mixins/filters'),
          // 'util': path.resolve(__dirname, './src/util'),
          'util': path.resolve(__dirname, './src/mixins/util'),
          'mixins': path.resolve(__dirname, './src/mixins'),
          'styles': path.resolve(__dirname, './src/styles'),
          'assets': path.resolve(__dirname, './src/assets')
        } // 别名配置,
      }
    });
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // css相关配置
  css: {
    extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {
      css: {}, // 这里的选项会传递给 css-loader
      postcss: {} // 这里的选项会传递给 postcss-loader
    }, // css预设器配置项
    requireModuleExtension: true
    // modules: false // 启用 CSS modules for all css / pre-processor files.
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0', // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    } // 错误、警告在页面弹出
    // proxy: {
    //     '/api': {
    //         target: 'http://www.baidu.com/api',
    //         changeOrigin: true, // 允许websockets跨域
    //         // ws: true,
    //         pathRewrite: {
    //             '^/api': ''
    //         }
    //     }
    // } // 代理转发配置，用于调试环境
  },
  // 第三方插件配置
  pluginOptions: {}
};
