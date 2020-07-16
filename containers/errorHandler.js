const debug = require("debug")("app:errorHandler");
const config = require("config");
const morgan = require("morgan");
const winston = require("winston");
require("winston-mongodb");

module.exports = function (app) {
    // * CHECKING FOR MISSING ENVIRONMENTAL VARIABLES
    if (!config.get("vividly_jwtkey")) {
        console.error("FATAL ERROR: JWTKEY is not defined");
        process.exit(1);
    }

    if (!config.get("mail.password")) {
        console.error("FATAL ERROR: Mail Password is not defined");
        process.exit(1);
    }

    debug("Application Name: " + config.get("name"));
    debug("Mail Password: " + config.get("mail.password"));
    if (app.get("env") === "development") {
        app.use(morgan("tiny"));
        debug("Morgan Enabled");
    }

    // * Winston is a better choice
    // //  * Using the process object to handle Uncaught Exception Errors
    // process.on("uncaughtException", (ex) => {
    //     debug("We GOT AN UNCAUGHT EXCEPTION");
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // // * Using the process object to handle Unhandled Rejection Errors
    // process.on("unhandledRejection", (ex) => {
    //     debug("We GOT AN UNHANDLED REJECTION");
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // * Configuring winston to handle uncaught errors
    winston.handleExceptions(
        new winston.transports.File({ filename: "uncaught.log" })
    );
    // * Throwing unhandled rejections to uncaught errors
    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    // * Setting up winston
    winston.add(winston.transports.File, { filename: "logfile.log" });
    winston.add(winston.transports.MongoDB, {
        db: "mongodb://localhost/playground",
    });

    // throw new Error("Somethin failed during startup ");

    // const p = Promise.reject(new Error("REJECTED PROMISE"));
    // p.then(() => console.log("Done"));

    // .catch((err) => debug("Error: ", err));
};
module.exports.port = config.get("port");
