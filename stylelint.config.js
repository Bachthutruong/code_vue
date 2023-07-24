module.exports = {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'selector-anb-no-unmatchable': null,
  },
  ignore: [
    'consecutive-duplicates',
    'consecutive-duplicates-with-different-values',
    'consecutive-duplicates-with-different-syntaxes',
  ],
};
