const mongoose = require("mongoose");
const { genreSchema } = require("./Genre");
const debug = require("debug")("app:Movies");
const joi = require("@hapi/joi");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        default: 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        max: 255,
    },
});
const validateMovie = (data) => {
    debug("Validating");
    const schema = joi.object({
        title: joi.string().min(2).max(40).required(),
        genreId: joi.objectId().required(2),
        numberInStock: joi.number().min(0).required(),
        dailyRentalRate: joi.number().min(0).required(),
    });

    return schema.validate(data);
};

module.exports = {
    Movie: mongoose.model("Movie", movieSchema),
    validate: validateMovie,
};
