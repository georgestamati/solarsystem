const { createCjsPreset } = require('jest-preset-angular/presets');

/** @type {import('jest').Config} */
module.exports = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$|gsap|ngx-cookie-service))'],
  moduleNameMapper: {
    '\\.(scss|sass|css)$': '<rootDir>/src/test-style.stub.ts',
    '\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/src/test-asset.stub.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json', 'mjs'],
  testMatch: ['**/src/**/*.spec.ts'],
  modulePathIgnorePatterns: ['\\.claude'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
  ],
};
