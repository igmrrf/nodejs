const joi = require("@hapi/joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:customerRoute");

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        default(value) {
            return value && value.length > 0;
        },
        minlength: 3,
        maxlength: 40,
    },
    phone: {
        type: String,
        minlength: 7,
        maxlength: 20,
    },
});

const validateCustomer = (data) => {
    debug("Validating");
    const schema = joi.object({
        name: joi.string().min(5).max(50).required(),
        isGold: joi.boolean().required(),
        phone: joi.string(),
    });
    return schema.validate(data);
};

const Customer = mongoose.model("Customer", customerSchema);

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
