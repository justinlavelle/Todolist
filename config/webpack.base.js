const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  resolve: {
    symlinks: false,
    cacheWithContext: false,
    extensions: ['.vue', '.js'],
    alias: {
      ['@assets']: path.resolve(__dirname, '../src/assets/'),
      ['@components']: path.resolve(__dirname, '../src/components'),
      ['@core']: path.resolve(__dirname, '../src/core'),
    },
  },
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, '../src/renderer/images'),
        use: {
          loader: 'svgo-loader',
          options: {
            externalConfig: 'svgo-config.yml',
          },
        },
      },
      {
        test: /\.svg$/,
        issuer: /\.(vue|js|ts|svg)$/,
        use: [
          // This loader compiles .svg file to .vue file
          // So we use `vue-loader` after it
          'vue-loader',
          'svg-to-vue-component/loader',
        ],
      },
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
          query: {
            compact: true,
          },
        },
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
      },
    ],
  },
}
