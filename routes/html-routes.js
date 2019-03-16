//dependencies
var express = require("express");
const router = express.Router()
var db = require("../models");

// module.exports = function(app) {
    
    router.get("/", function(req, res){
        db.Pet.findAll({
            include: [{model: db.User}]

        })
        .then (function (dbPets){
            res.render("index", dbPets)
          })

    });

// }


//export router
module.exports = router
