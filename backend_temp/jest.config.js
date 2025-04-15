/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!**/node_modules/**',
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  }