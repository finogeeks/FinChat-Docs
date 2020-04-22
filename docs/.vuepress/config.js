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
        displayAllHeaders: true,
        sidebarDepth: 2,
        smoothScroll: true,
        nav: [
            // { text: '首页', link: '/' },
            // { text: '文档', link: '/finchat/bot.md' }
            { text: '概述', link: '/intro.md' },
            {
                text: '前端无形',
                ariaLabel: '前端',
                items: [
                    {
                        text: '移动端集成',
                        items: [
                            {
                                text: '移动端集成',
                                link: '/backend/bot.md',
                            },
                            {
                                text: 'Android集成',
                                link: '/intro.md',
                            },
                        ],
                    },
                    {
                        text: '移动端集成',
                        items: [
                            {
                                text: 'IOS集成',
                                link: '',
                            },
                            {
                                text: 'Android集成',
                                link: '',
                            },
                        ],
                    },
                    {
                        text: '桌面端集成',
                        items: [
                            {
                                text: '本地通讯协议',
                                link: '/frontend/api_socket.md',
                            },
                            {
                                text: '链接唤起协议',
                                link: '',
                            },
                        ],
                    },
                    {
                        text: '其他端集成',
                        items: [
                            {
                                text: 'H5',
                                link: '',
                            },
                            {
                                text: '小程序',
                                link: '',
                            },
                        ],
                    },
                    {
                        text: '示例',
                        items: [
                            {
                                text: '音视频对接',
                                link: '',
                            },
                        ],
                    },
                ],
            },
            {
                text: '后端开放',
                ariaLabel: '后端',
                items: [
                    {
                        text: '应用市场',
                        items: [
                            {
                                text: '自建应用流程',
                                link: '/backend/finstore.md',
                            },
                        ],
                    },
                    {
                      text: '示例',
                      items: [
                          {
                              text: '欢迎机器人',
                              link: '',
                          },
                          {
                            text: '机器人 + CUI',
                            link: '/backend/bot.md',
                        },
                        {
                          text: '网页应用',
                          link: '',
                      },
                      ],
                  },
                  {
                    text: 'FAAS平台', link: '',
                  }
                ],
            },
            {
              text: 'API文档',
              ariaLabel: 'API文档',
              items: [
                {
                  text: '服务端API',
                  link: '/api/api_server.md',
                },
                {
                  text: '客户端API',
                  link: '/api/api_client.md',
                }
              ],
            },
            {
              text: '部署',
              ariaLabel: '部署',
              items: [
                {
                  text: '后端一键部署',
                  link: '/deploy/finchat_autoDeploy.md',
                },
                {
                  text: 'POC部署',
                  link: '',
                }
              ],
            },
            {
              text: '附录',
              ariaLabel: '附录',
              items: [
                {
                  text: '常见问题',
                  link: ''
                }
              ],
            },
        ],
        sidebar: 'auto',
    },
};
