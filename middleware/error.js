const winston = require("winston");

module.exports = (err, req, res, next) => {
    // winston.log("error", err.message);
    // winston.error(err.message);
    winston.error(err.message, err);

    //error
    //warning
    //info

    //verbose
    //debug
    //silly
    res.status(500).send("Something Broke");

    next(err);
};
