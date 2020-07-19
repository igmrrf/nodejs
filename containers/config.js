const debug = require("debug")("app:config");
const config = require("config");
const morgan = require("morgan");

module.exports = function (app) {
  // * CHECKING FOR MISSING ENVIRONMENTAL VARIABLES
  if (!config.get("vividly_jwtkey")) {
    throw new Error("FATAL ERROR: JWTKEY is not defined");
  }

  if (!config.get("mail.password")) {
    throw new Error("FATAL ERROR: Mail Password is not defined");
  }

  debug("Application Name: " + config.get("name"));
  debug("Mail Password: " + config.get("mail.password"));
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan Enabled");
  }
};
