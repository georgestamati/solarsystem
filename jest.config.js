/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['/tmp/angular-test-setup.js'],
  testEnvironment: '/tmp/j2/node_modules/jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'html', 'json'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      '/tmp/j2/node_modules/jest-preset-angular/build/index.js',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: /\.html$/ },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^zone\\.js/(.+)$': '/tmp/j2/node_modules/zone.js/$1',
    '^zone\\.js$': '/tmp/j2/node_modules/zone.js/bundles/zone.umd.js',
    '^@angular/core/testing$': '/tmp/j2/node_modules/@angular/core/fesm2022/testing.mjs',
    '^@angular/platform-browser-dynamic/testing$': '/tmp/j2/node_modules/@angular/platform-browser-dynamic/fesm2022/testing.mjs',
    '^@angular/platform-browser/testing$': '/tmp/j2/node_modules/@angular/platform-browser/fesm2022/testing.mjs',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  modulePaths: ['/sessions/sharp-sweet-turing/mnt/solarsystem/node_modules', '/tmp/j2/node_modules'],
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
