const mockStorage = {};

module.exports = {
  default: {
    setItem: jest.fn((key, value) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key) => Promise.resolve(mockStorage[key] || null)),
    removeItem: jest.fn((key) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStorage))),
    multiGet: jest.fn((keys) => Promise.resolve(keys.map(key => [key, mockStorage[key]]))),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([key, value]) => { mockStorage[key] = value; });
      return Promise.resolve();
    }),
  },
  // Export for clearing in tests
  __mockStorage: mockStorage,
};
