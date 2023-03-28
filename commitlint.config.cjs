module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'chore',    // 其他修改、杂项
                'docs',     // 文档
                'feat',     // 新特性、新功能
                'fix',      // 修改bug
                'perf',     // 优化
                'refactor', // 代码重构
                'revert',   // 回滚
                'style'     // 格式修改
            ]
        ]
    }
}
