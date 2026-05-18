/** @type {import('jest').Config} */
const fs = require('fs');
const path = require('path');

// Locate jest-preset-angular transformer
function resolveTransformer() {
  const candidates = [
    path.join(__dirname, 'node_modules', 'jest-preset-angular', 'build', 'index.js'),
    '/tmp/j3/node_modules/jest-preset-angular/build/index.js',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'jest-preset-angular';
}

// Locate jest-environment-jsdom (verify jsdom dep is present)
function resolveTestEnv() {
  const projectToughCookie = path.join(__dirname, 'node_modules', 'tough-cookie', 'package.json');
  const projectEnv = path.join(__dirname, 'node_modules', 'jest-environment-jsdom');
  if (fs.existsSync(projectEnv) && fs.existsSync(projectToughCookie)) return projectEnv;
  for (const base of ['/tmp/j3', '/tmp/j2']) {
    const e = path.join(base, 'node_modules', 'jest-environment-jsdom');
    if (fs.existsSync(e)) return e;
  }
  return 'jest-environment-jsdom';
}

// Build module search paths.
// In the dev sandbox, Angular package.json files on the NTFS mount are unreadable
// from Linux, so we put /tmp/j3 (a full npm install) FIRST so jest can resolve
// Angular packages. On Windows after `npm install` these tmp paths don't exist
// and jest uses the project's node_modules directly.
const modulePaths = [];
for (const base of ['/tmp/j3/node_modules', '/tmp/j2/node_modules']) {
  if (fs.existsSync(base)) { modulePaths.push(base); break; }
}
modulePaths.push('<rootDir>/node_modules');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: resolveTestEnv(),
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'html', 'json'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      resolveTransformer(),
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: /\.(html|svg)$/ },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$))'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  modulePaths,
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
