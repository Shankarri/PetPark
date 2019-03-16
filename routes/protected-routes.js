//dependencies
var express = require("express");
const router = express.Router()
var db = require("../models");
const jwt_express = require('express-jwt');


// this is just a fancy way of making 3 variables. 
const { JWT_OPTIONS, JWT_SECRET_KEY, TEST_USER } = require('../config/jwt')


//tell express to use JSON WebTokens. JWT-Express will autofill req.user with the user details
router.use(jwt_express({ secret: JWT_SECRET_KEY }).unless({ path: ['/token', '/favicon.ico'] }));

// post a new pet
router.post("/api/newpet", function (req, res) {
    db.Pet.create({
        name: req.body.name,
        img: req.body.img,
        UserId: req.user.id
    })
        .then(function (result) {
            res.json(result);
        });
});

// delete a pet
router.delete("/api/pet/:id", function (req, res) {
    db.Pet.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {
            let userId = data.UserId
            if (userId === req.user.id) {
                db.Pet.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(function (result) {
                    res.json(result)
                })
            } else {
                res.json("notOwner")
            }
        })


})



//export router
module.exports = router
