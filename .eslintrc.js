module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  env: {
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    // Add any custom rules here
  },
};
