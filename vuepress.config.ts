import { defineUserConfig, defaultTheme } from 'vuepress'
import { navbar } from './plugins'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'Fe Blog',
    description: '原创前端技术blog，致力于分享前端开发经验',
    base: '/web/',
    head: [
        ['link', { rel: 'icon', href: '/imgs/vuepress.png' }] 
    ],
    theme: defaultTheme({
        logo: '/imgs/vuepress.png',
        navbar,
        repo: 'https://github.com/async-codeper/docs',
        editLink: false
    }),
    dest: 'dist',
    public: 'public',
    plugins: [
    ]
})