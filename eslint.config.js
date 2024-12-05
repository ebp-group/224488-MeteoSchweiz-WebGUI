// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const ngrx = require('@ngrx/eslint-plugin/v9');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierRecommended,
      ...ngrx.configs.all,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'rxjs-angular/prefer-composition': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: '',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: [''],
          style: 'camelCase',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          ignoredMethodNames: ['ngOnInit', 'ngOnDestroy', 'ngAfterViewInit'],
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
          ignoreProperties: true,
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'property',
          format: ['UPPER_CASE', 'camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['objectLiteralProperty'],
          format: null,
          modifiers: ['requiresQuotes'],
        },
        {
          selector: ['enum', 'enumMember'],
          format: ['PascalCase'],
        },
      ],
      'arrow-parens': ['off', 'always'],
      'rxjs/no-ignored-observable': 'warn',
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': [
        'error',
        {
          allowIndexSignaturePropertyAccess: true,
        },
      ],
      'id-denylist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
      'no-underscore-dangle': 'off',
      'arrow-body-style': 'off',
      'import/order': 'off',
      'no-empty-function': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'no-unused-expressions': 'error',
      'no-use-before-define': 'off',
      eqeqeq: [2, 'smart'],
      semi: 'error',
      'prefer-template': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': ['warn', {allow: ['warn', 'error']}],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility, prettierRecommended],
    rules: {
      '@angular-eslint/template/eqeqeq': [
        'error',
        {
          allowNullOrUndefined: true,
        },
      ],
    },
  },
);
