const express = require("express");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const ValidateObject = require('../middleware/validateObjectId')
const debug = require("debug")("app:route:genre");
const router = express.Router();
const {Genre, validate} = require("../models/Genre");

router.get("/", async (req, res) => {
    const genre = await Genre.find().sort("name");
    if (!genre) return res.status(404).send("Genre not found")
    if (genre.length < 1) return res.send("Genre Collection is empty")
    res.send(genre);
    
});


router.get("/:id", ValidateObject, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre)

        return res
            .status(404)
            .send({success: false, message: "Genre could not be found"});
    res.status(200).send(genre);
});

router.post("/", Auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({success: false, message: error.details[0].message});
    debug("Validated");
    const genre = new Genre({
        name: req.body.name,
    });
    await genre.save();
    res.send(genre);
});

router.put("/:id", [ValidateObject, Auth], async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({success: false, message: error.details[0].message});
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        })
        if (genre) return res.send(genre);
        return res.status(404).send({
            success: false,
            message: "Genre could not be found",
        });
    } catch (e) {
        res.send({
            status: false,
            message: "There was an error",
        });

    }
});

router.delete("/:id", [ValidateObject, Auth, Admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
        return res
            .status(404)
            .send({success: false, message: "Genre could not be found"});

    res.status(200).send(genre);
});

module.exports = router;
