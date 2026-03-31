const nextJest = require('next/jest');

const criarConfigJest = nextJest({ dir: './' });

const configuracaoCustomizada = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__testes__/**/*.test.{js,jsx}'],
  coverageDirectory: '<rootDir>/cobertura-dos-testes',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

module.exports = criarConfigJest(configuracaoCustomizada);
