const express = require("express");
const debug = require("debug")("app:route:rental");
const { Customer } = require("../models/Customers");
const Auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { Movie } = require("../models/Movies");
const asyncMiddleware = require("../middleware/async");
const Fawn = require("fawn");
const router = express.Router();
const { Rental, validate } = require("../models/Rental");

Fawn.init(mongoose);

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const rental = await Rental.find().sort("-dateOut");
        res.send(rental);
    })
);

router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const rental = await Rental.findById(req.params.id);
        if (!rental)
            return res
                .status(404)
                .send({ success: false, message: "rental could not be found" });
        res.status(200).send(rental);
    })
);

router.post(
    "/",
    Auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        const { customerId, movieId } = req.body;

        if (error)
            return res
                .status(400)
                .send({ success: false, message: error.details[0].message });
        debug("Validated");

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send("Invalid customer Id");

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send("Invalid Movie Id");

        if (movie.numberInStock === 0)
            return res.status(400).send("Movie not in stock");
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });
        try {
            new Fawn.Task()
                .save("rentals", rental)
                .update(
                    "movies",
                    { _id: movie._id },
                    {
                        $inc: { numberInStock: -1 },
                    }
                )
                .run();
            res.send(rental);
        } catch (err) {
            res.status(500).send("Something broke");
        }
    })
);

router.put(
    "/:id",
    Auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        if (error)
            return res
                .statusCode(400)
                .send({ success: false, message: error.details[0].message });
        try {
            const rental = await Rental.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
            });
            if (!rental)
                return res
                    .status(404)
                    .send({
                        success: false,
                        message: "rental could not be found",
                    });
            res.send(rental);
        } catch (e) {
            debug(e);
            res.send({
                status: false,
                message: "There was an error",
            });
            return;
        }
    })
);

router.delete(
    "/:id",
    Auth,
    asyncMiddleware(async (req, res) => {
        const rental = await Rental.findByIdAndRemove(req.params.id);
        if (!rental)
            return res
                .status(404)
                .send({ success: false, message: "rental could not be found" });

        res.status(200).send(rental);
    })
);

module.exports = router;
