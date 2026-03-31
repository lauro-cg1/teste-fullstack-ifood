import '../src/app/globals.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^ao[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|cor)/i,
        date: /Data$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
