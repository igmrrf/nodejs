const mongoose = require("mongoose");
const debug = require("debug")("app:model:genre");
const joi = require("@hapi/joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        min: 5,
        max: 20,
        required: true,
        trim: true,
        lowercase: true,
    },
});

const validateInput = (data) => {
    debug("Validating");
    const schema = joi.object({
        name: joi.string().min(5).max(20).required(),
    });
    return schema.validate(data);
};

module.exports = {
    Genre: mongoose.model("Genre", genreSchema),
    validate: validateInput,
    genreSchema: genreSchema,
};
