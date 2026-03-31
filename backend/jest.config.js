module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/testes/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'cobertura dos testes',
  verbose: true,
  setupFilesAfterEnv: ['./testes/configuracao.js']
};
