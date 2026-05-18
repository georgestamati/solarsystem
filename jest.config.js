/** @type {import('jest').Config} */
const fs = require('fs');
const path = require('path');

function resolveTransformer() {
  const candidates = [
    path.join(__dirname, 'node_modules', 'jest-preset-angular', 'build', 'index.js'),
    '/tmp/j2/node_modules/jest-preset-angular/build/index.js',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'jest-preset-angular';
}

function resolveTestEnv() {
  // Verify the project's jsdom is fully installed (check a deep dep as a proxy)
  const projectJsdomMain = path.join(__dirname, 'node_modules', 'jsdom', 'lib', 'api.js');
  const projectToughCookie = path.join(__dirname, 'node_modules', 'tough-cookie', 'package.json');
  const projectEnv = path.join(__dirname, 'node_modules', 'jest-environment-jsdom');
  if (fs.existsSync(projectEnv) && fs.existsSync(projectJsdomMain) && fs.existsSync(projectToughCookie)) {
    return projectEnv;
  }
  const sandboxEnv = '/tmp/j2/node_modules/jest-environment-jsdom';
  if (fs.existsSync(sandboxEnv)) return sandboxEnv;
  return 'jest-environment-jsdom';
}

const sandboxModules = '/tmp/j2/node_modules';
const extraPaths = fs.existsSync(sandboxModules) ? [sandboxModules] : [];

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: resolveTestEnv(),
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'html', 'json', 'cjs'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      resolveTransformer(),
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: /\.html$/ },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  modulePaths: ['<rootDir>/node_modules', ...extraPaths],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/app.config.ts',
    '!src/main.ts',
    '!src/environments/**',
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageThreshold: { global: { branches: 90, functions: 90, lines: 90, statements: 90 } },
};
