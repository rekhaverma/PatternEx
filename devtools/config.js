const path = require("path");

module.exports = {
  port: 8090,
  address: "0.0.0.0",
  SRC_PATH: path.join(__dirname, "../src"),
  DIST_PATH: path.join(__dirname, "../build"),
  skin: "default"
};
