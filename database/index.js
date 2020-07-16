const mongoose = require("mongoose");
const debug = require("debug")("app:db");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
    .connect("mongodb://localhost/playground")
    .then(() => debug("Successful Connection to database"))
    .catch((err) => debug("Error: ", err));
