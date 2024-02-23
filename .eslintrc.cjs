module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser'
    },
    {
      files: ['*.vue'],
      plugins: ['vue'],
      extends: ['plugin:vue/vue3-essential', 'plugin:vue/vue3-recommended'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
      },
      rules: {
        'vue/attributes-order': [
          'error',
          {
            order: [
              'EVENTS',
              'DEFINITION',
              'LIST_RENDERING',
              'CONDITIONALS',
              'RENDER_MODIFIERS',
              'GLOBAL',
              ['UNIQUE', 'SLOT'],
              'TWO_WAY_BINDING',
              'OTHER_DIRECTIVES',
              'OTHER_ATTR',
              'CONTENT'
            ],
            alphabetical: true
          }
        ],
        'vue/multi-word-component-names': 'off',
        // 配置Vue属性换行规则
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 1
          },
          multiline: {
            max: 1
          }
        }]
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
