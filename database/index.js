const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("Successful Connection to database"))
    .catch((err) => console.log("Error: ", err));




