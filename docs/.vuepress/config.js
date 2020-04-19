module.exports = {
  base: '/finchat-oss/',
  title: 'finchat-oss',
  description: 'finchat-oss',
  themeConfig: {
    // 你的GitHub仓库，请正确填写
    repo: 'https://github.com/finogeeks/finchat-oss',
    // 自定义仓库链接文字。
    repoLabel: 'finchat-oss',
    // logo: '/assets/img/logo.png',
    nav: [
        { text: '首页', link: '/' },
        { text: '文档', link: '/finchat/bot.md' }
    ],
    sidebar: [
      ['/finchat/intro.md', '介绍'],
      ['/finchat/bot.md', '机器人开发文档']
    ]
  }
}