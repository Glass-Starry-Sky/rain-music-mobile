const { defineConfig } = require('@vue/cli-service')

//vant自动引入方案
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  //修改相对路劲， 不加，就可能导致打包后的vue项目页面显示空白
  publicPath: './',

  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,

    // 代理
    //目前把api全部都删了，可能会无法请求，2022/9/27  ---  可以采用baseUrl的方式加上 2022/10/18
    proxy: {
      '/api': {
        target: 'https://autumnfish.cn',  // 后台接口域名
        ws: true,        //如果要代理 websockets，配置这个参数
        secure: true,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },



  //vant自动引入方案
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
})
