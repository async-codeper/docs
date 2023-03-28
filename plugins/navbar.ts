import type { NavbarConfig } from 'vuepress'

export const navbar: NavbarConfig = [
    { text: '分享', link: '/share' },
    {
        text: '框架',
        children: [
            {
                text: 'Vue',
                children: [
                    { text: 'CompositionApi', link: '/fe/vue/composition' },
                    { text: 'Pinia', link: '/fe/vue/pinia' },
                    { text: 'VueRouter', link: '/fe/vue/router' }
                ]
            },
            {
                text: 'React',
                children: [
                    { text: 'React总结', link: '/fe/react' }
                ]
            },
            {
                text: 'Typescript',
                children: [
                    { text: 'ts入门', link: '/fe/ts/base' },
                    { text: '泛型函数', link: '/fe/ts/senior' },
                    { text: '声明文件', link: '/fe/ts/declare' },
                    { text: '编译配置', link: '/fe/ts/config' }
                ]
            },
            {
                text: 'XHR',
                children: [
                    { text: 'Axios', link: '' },
                    { text: 'Fetch', link: '' }
                ]
            },
            {
                text: '微信小程序',
                children: []
            },
            {
                text: 'Taro',
                children: []
            },
            {
                text: 'ThreeJs',
                children: []
            },
            {
                text: 'Css',
                children: [
                    { text: 'TailwindCss', link: '' },
                    { text: 'Sass', link: '' },
                    { text: 'flex', link: '' }
                ]
            },
            {
                text: 'Regexp',
                children: []
            },
            {
                text: 'Canvas',
                children: []
            },
            {
                text: 'Svg',
                children: []
            }
        ]
    },
    {
        text: '工具',
        children: [
            {
                text: 'Vite',
                children: []
            },
            {
                text: 'Webpack',
                children: []
            },
            {
                text: 'Rollup',
                children: []
            }
        ]
    }
]