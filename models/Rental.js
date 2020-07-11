const joi = require("@hapi/joi");
const mongoose = require("mongoose");
joi.objectId = require("joi-objectid")(joi);

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 8,
                maxlength: 20,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                default: "",
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                default: 0,
                max: 255,
                required: true,
            },
        }),
        required: true,
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

function validateRental(rental) {
    const schema = joi.object({
        customerId: joi.objectId().required(),
        movieId: joi.objectId().required(),
    });
    return schema.validate(rental);
}

module.exports = {
    Rental: mongoose.model("Rental", rentalSchema),
    validate: validateRental,
};
