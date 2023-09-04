import type {Config} from '@jest/types';
import * as path from 'path';

// Or async function
export default async (): Promise<Config.InitialOptions> => ({
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  setupFiles: [
    '<rootDir>/src/setupTests.tsx',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/?!(react-movable|yet-another-react-lightbox)',
    'jest-runner'
  ],
  collectCoverage: true,
  testMatch: ['**/?*.test.ts', '**/?*.test.tsx'],
  coverageReporters: ['text', 'html', 'html-spa', 'lcov'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 25,
      lines: 30,
      functions: 25,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/src/config.ts',
    '/src/ironman-integration/',
  ],
  moduleDirectories: ['node_modules', path.join(__dirname, 'src')],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js',
    'react-i18next': '<rootDir>/__mocks__/reacti18nextMock.js',
    'yet-another-react-lightbox/plugins': '<rootDir>/node_modules/yet-another-react-lightbox/dist/plugins',
  }
});
