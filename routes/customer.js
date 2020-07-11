const express = require("express");
const debug = require("debug")("app:route");
const router = express.Router();
const { Customer, validate } = require("../models/Customers");

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
        return res
            .status(404)
            .send({ success: false, message: "customer could not be found" });
    res.status(200).send(customer);
});

router.post("/", async (req, res) => {
    const { phone, isGold, name } = req.body;
    const { error } = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });
    debug("Validated");
    const customer = new Customer({ name, phone, isGold });
    await customer.save();
    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res
            .statusCode(400)
            .send({ success: false, message: error.details[0].message });
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id);
        if (!customer)
            return res.status(404).send({
                success: false,
                message: "customer could not be found",
            });
        res.send(customer);
    } catch (e) {
        debug(e);
        res.send({
            status: false,
            message: "There was an error",
        });
        return;
    }
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)
        return res
            .status(404)
            .send({ success: false, message: "customer could not be found" });

    res.status(200).send(customer);
});

module.exports = router;
