import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: [
    // Organize stories by atomic design hierarchy
    '../src/components/atoms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/molecules/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/organisms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/templates/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/features/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Fallback for any other stories
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  features: {
    storyStoreV7: true,
  },
  webpackFinal: async (config) => {
    // Add support for absolute imports
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, '../src'),
      };
    }
    return config;
  },
}

export default config