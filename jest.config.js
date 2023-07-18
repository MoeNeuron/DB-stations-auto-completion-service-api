module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["ts-mockito"],
};
