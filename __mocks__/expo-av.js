module.exports = {
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn().mockResolvedValue({}),
          stopAsync: jest.fn().mockResolvedValue({}),
          unloadAsync: jest.fn().mockResolvedValue({}),
          setPositionAsync: jest.fn().mockResolvedValue({}),
          setVolumeAsync: jest.fn().mockResolvedValue({}),
        },
        status: { isLoaded: true },
      }),
    },
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
  },
  Video: 'Video',
};
