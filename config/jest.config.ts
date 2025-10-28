const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',									    // Use TypeScript with Jest
  testEnvironment: 'node',									// Node.js environment (not browser)
  testMatch: ['**/*.spec.ts'],							    // Only run files ending in .spec.ts
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^config/(.*)$': '<rootDir>/config/$1'
  }
};