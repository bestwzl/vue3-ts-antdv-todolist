module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/", // 部署生产环境和开发环境下的URL
    outputDir: 'dist', // 构建输出目录(npm run build 或 yarn build 时 ，生成文件的目录名称)
    assetsDir: 'assets', // 用于放置生成的静态资源(js、css、img、fonts)的;（项目打包之后，静态资源会放在这个文件夹下）
    // 支持webPack-dev-server的所有选项
    devServer: {
        open: true, // 是否自动启动浏览器
        host: '0.0.0.0',
        port: 8086, // 端口号
        https: false,
        hotOnly: false,
        proxy: null,
        before: app => {}
    }
};
