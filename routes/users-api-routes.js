// Dependencies
var express = require("express");
const router = express.Router()
var db = require("../models");
const jwt = require('jsonwebtoken');

// this is just a fancy way of making 3 variables. 
const { JWT_OPTIONS, JWT_SECRET_KEY, TEST_USER } = require('../config/jwt')

// module.exports = function (app) {
    router.post("/api/newuser", function (req, res) {
        console.log(req.body)
        db.User.create(req.body)
            .then(function (result) {
                res.json(result);
            });
    });

    router.get("/api/user/:name", function (req, res) {
        console.log("======================================")
        console.log(req.params.name)
        console.log("======================================")
        db.User.findOne({
            where: {
                name: req.params.name
            },

            include: [{ model: db.Pet }]

        }).then(function (dbUser) {
            res.json(dbUser);
            console.log(dbUser)
        });
    });

    router.post('/token', function (req, res) {
        //Fetch the user from the database:
        db.User.findOne({
            where: {
                name: req.body.name,
            }
        })
            .then(function (data) {
                if (!data) return res.json("noUser"); //user wasn't found in the database, send a 404



                // do some sort of check that the user/password is correct:
                //in this case, we just have a password to check against. This is bad security. 
                // for better security, use something like bcrypt
                else if (data.password === req.body.password) {
                    const userDetails = {
                        name: data.name,
                        id: data.id,
                        created_at: data.created_at
                    };
                    return jwt.sign(userDetails, JWT_SECRET_KEY, JWT_OPTIONS,
                        function (err, token) {
                            console.log(token)
                            //if (err) return res.sendStatus(500).json(err) //do some error checking
                            res.json({
                                user: userDetails,
                                token: token,
                            })

                        })
                }
                else {
                    res.json("passwordWrong"); //password incorrect, send a 401 [Unauthorized]
                }
            })
            .catch(function (err) {
                
                return res.json(500,err)
            })


    });

    router.delete("/api/users/:id", function (req, res) {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

// };

//export router
module.exports = router
