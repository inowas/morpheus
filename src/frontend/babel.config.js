module.exports = api => {
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      "@babel/preset-react",
      '@babel/preset-typescript',
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread"
    ]
  };
};
