module.exports = {
  'src/**/*.{ts}': () => 'yarn check-types',
  'src/**/*.{js,ts}': [
    'eslint --fix',
  ],
};
