module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  staticDirs: [
    './public'
  ],
  docs: {},

};
