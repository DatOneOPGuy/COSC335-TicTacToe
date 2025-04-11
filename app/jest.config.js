export default {
  projects: [
    {
      displayName: 'logic',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/logic.test.js'],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
    },
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/ui.test.js'],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
    },
  ],
};