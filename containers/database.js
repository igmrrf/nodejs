const mongoose = require("mongoose");
const winston = require("winston");
const config = require('config')

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
module.exports = function () {
    mongoose
        .connect(config.get('db'), {
            serverSelectionTimeoutMS: 5000
        })
        .then(() => winston.info(`Successful Connection to ${config.get("db")}`));
};
