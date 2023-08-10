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
          { text: '完全指南', link: '/guide' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
