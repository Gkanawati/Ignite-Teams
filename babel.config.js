module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@storage': './src/storage',
            '@screens': './src/screens',
            '@components': './src/components',
          },
        },
      ]
    ],
  };
};
