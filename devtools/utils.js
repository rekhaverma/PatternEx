module.exports = {
  parseArgs: (env = {}, defaults) => {
    return {
      skin: env.skin || defaults.skin
    };
  },
};
