module.exports = {
  'setupFiles': ['./test/jest.setup.js'],
  'moduleDirectories': ['node_modules', 'src'],
  'moduleNameMapper': {
    '^.+\\.(css|scss|style)$': '<rootDir>/test/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMock.js',
  },
  'transform': {
    '.*': '<rootDir>/node_modules/babel-jest',
  },
  'testRegex': '(/__tests__/.*|(\\.(test|spec)))|(Test|Spec)\\.(js|jsx|ts|tsx)$',
  'testPathIgnorePatterns': [
    '/node_modules/',
    '/devtools/',
    '/src/public/',
    '/test/',
    '__snapshots__/',
  ],
  'collectCoverageFrom': [
    "src/**/*.{jsx}",
  ],
  'coveragePathIgnorePatterns': [
    '/node_modules/',
    '/devtools/',
    '/src/public/',
    '/test/',
  ],
  'coverageReporters': ["html"],
  'snapshotSerializers': ['<rootDir>/node_modules/enzyme-to-json/serializer'],
  'browser': true,
};
