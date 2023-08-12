import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Truth-cli',
  description: 'A command-line tool for analyzing dependencies under node_modules',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/index.md' },
          { text: '完全指南', link: '/guide/full.md' },
          { text: 'API', link: '/guide/api.md' },
        ],
        collapsed: false,
      },
      {
        text: '关于 truth-cli',
        items: [
          { text: '原理介绍', link: '/principle/how.md' },
          { text: '优化', link: '/principle/optimize.md' },
        ],
        collapsed: false,
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
