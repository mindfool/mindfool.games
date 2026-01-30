module.exports = {
  Canvas: 'Canvas',
  Path: jest.fn(),
  Skia: {
    Path: jest.fn().mockReturnValue({
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      close: jest.fn(),
    }),
    Color: jest.fn(),
  },
  useValue: jest.fn().mockReturnValue({ current: 0 }),
  useComputedValue: jest.fn().mockReturnValue({ current: 0 }),
  useTiming: jest.fn().mockReturnValue({ current: 0 }),
  useLoop: jest.fn().mockReturnValue({ current: 0 }),
  useDerivedValue: jest.fn().mockReturnValue({ current: 0 }),
  useSharedValueEffect: jest.fn(),
  runTiming: jest.fn(),
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    bezier: jest.fn(),
  },
};
