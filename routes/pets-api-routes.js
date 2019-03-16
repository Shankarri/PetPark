//dependencies
var express = require("express");
const router = express.Router()
var db = require("../models");
var moment = require("moment");



// module.exports = function(app) {
    //get all pets
    //get a specific pet info
    router.get("/api/pets/", function(req,res){
        db.Pet.findAll({
            include: [{model: db.User}],
        })
        .then (function (dbPets){
            res.json(dbPets);
        });
    });
    router.get("/api/pet/:id", function(req,res){
        db.Pet.findOne({
            include: [{model: db.User}],
            where:{
                id: req.params.id
            }
        })
        .then (function (dbPets){
            res.json(dbPets);
        });
    });
    //put route which udpates the pet information based on time
    router.put("/api/p/", function(req, res){
        //get all pet data from the Pet table in the database
        db.Pet.findAll({})
        .then(function(foundPets) {
            //run timeUpdate on pet data to update pet data
            return timeUpdate(foundPets)
        })
        .then(function(results) {
            //for loop to update all pets in the Pet table with the  
            //updated pet data from the timeUpdate function
            for(let j in results){
                db.Pet.update({
                    alive: results[j].alive,
                    hp: results[j].hp,
                    hungry: results[j].hungry,
                    sleepy: results[j].sleepy,
                    happy: results[j].happy,
                    lastFed: results[j].lastFed,
                    lastSlept: results[j].lastSlept,
                    lastPlayed: results[j].lastPlayed
                },
                {
                    where: {
                        id: results[j].id
                    }
                }
            )}
            // console.log("results: ", results)
        }).then (function (result){
            // console.log("finished");
            res.json(result)
        });
        //function that updates the pet information based off of time
        function timeUpdate(dbData) {
            //empty array which will have updated pet information pushed to
            let petArray = [];
            //for loop to update all the pets in the database
            for (let i in dbData) {
                //declare variables that calculates hours since lastFed/Slept/Played and saves it as a float
                let momDifFed = parseFloat(moment().diff(dbData[i].dataValues.lastFed, 'hours', true));
                let momDifSlept = parseFloat(moment().diff(dbData[i].dataValues.lastSlept, 'hours', true));
                let momDifPlayed = parseFloat(moment().diff(dbData[i].dataValues.lastPlayed, 'hours', true));
                // ==========================================================================================
                //if 10 hours have passed, subtract 5 from hungry
                if (momDifFed >= 10) {
                    //subract 5 from hungry
                    dbData[i].dataValues.hungry -= 5;
                }
                //if 8 hours have passed since lastFed,
                else if (momDifFed >= 8) {
                    //subtract 4 from hungry
                    dbData[i].dataValues.hungry -= 4;
                    //update lastFed time to a time that is the (lastFed time) - (8 hours) from the current time
                    //ex: if fed 9 hours ago and the current time is 3:00pm, the new lastFed 
                    //time will be 2:00pm (9-8=1 and 1 hour from current time (3:00pm) is 2:00pm)
                    dbData[i].dataValues.lastFed = moment().subtract(momDifFed - 8, 'hours').format()
                }
                //if 6 hours have passed since lastFed,
                else if (momDifFed >= 6) {
                    //subtract 3 from hungry
                    dbData[i].dataValues.hungry -= 3;
                    //update lastFed to a time that is (lastFed time) - (6 hours) from the current time
                    dbData[i].dataValues.lastFed = moment().subtract(momDifFed - 6, 'hours').format()
                }
                //if 4 hours have passed since lastFed,
                else if (momDifFed >= 4) {
                    //subtract 2 from hungry
                    dbData[i].dataValues.hungry -= 2;
                    //update lastFed to a time that is (lastFed time) - (4 hours) from the current time
                    dbData[i].dataValues.lastFed = moment().subtract(momDifFed - 4, 'hours').format()
                }
                //if 2 hours have passed since lastFed,
                else if (momDifFed >= 2) {
                    //subtract 1 from hungry
                    dbData[i].dataValues.hungry -= 1;
                    //update lastFed to a time that is (lastFed time) - (2 hours) from the current time
                    dbData[i].dataValues.lastFed = moment().subtract(momDifFed - 2, 'hours').format()
                };
                //=======================================================================================
                //if 30 hours have passed since lastSlept
                if (momDifSlept >= 30) {
                    //subtract 5 from sleepy
                    dbData[i].dataValues.sleepy -= 5;
                }
                //if 24 hours have passed since lastSlept
                else if (momDifSlept >= 24) {
                    //subtract 4 from sleepy
                    dbData[i].dataValues.sleepy -= 4;
                    //update lastSlept to a time that is (lastSlept time) - (24 hours) from the current time
                    dbData[i].dataValues.lastSlept = moment().subtract(momDifSlept - 24, 'hours').format()
                }
                //if 18 hours have passed since lastSlept
                else if (momDifSlept >= 18) {
                    //subtract 3 from sleepy
                    dbData[i].dataValues.sleepy -= 3;
                    //update lastSlept to a time that is (lastSlept time) - (18 hours) from the current time
                    dbData[i].dataValues.lastSlept = moment().subtract(momDifSlept - 18, 'hours').format()
                }
                //if 12 hours have passed since lastSlept
                else if (momDifSlept >= 12) {
                    //subtract 2 from sleepy
                    dbData[i].dataValues.sleepy -= 2;
                    //update lastSlept to a time that is (lastSlept time) - (12 hours) from the current time
                    dbData[i].dataValues.lastSlept = moment().subtract(momDifSlept - 12, 'hours').format()
                }
                //if 6 hours have passed since lastSlept
                else if (momDifSlept >= 6) {
                    //subtract 1 from sleepy
                    dbData[i].dataValues.sleepy -= 1;
                    //update lastSlept to a time that is (lastSlept time) - (6 hours) from the current time
                    dbData[i].dataValues.lastSlept = moment().subtract(momDifSlept - 6, 'hours').format()
                };
                // =================================================================================
                //if 15 hours have passed since lastPlayed
                if (momDifPlayed >= 15) {
                    //subtract 5 from happy
                    dbData[i].dataValues.happy -= 5;
                }
                //if 12 hours have passed since lastPlayed
                else if (momDifPlayed >= 12) {
                    //subtract 4 from happy
                    dbData[i].dataValues.happy -= 4;
                    //update lastPlayed to a time that is (lastPlayed time) - (12 hours) from the current time
                    dbData[i].dataValues.lastPlayed = moment().subtract(momDifPlayed - 12, 'hours').format()
                }
                //if 9 hours have passed since lastPlayed
                else if (momDifPlayed >= 9) {
                    //subtract 3 from happy
                    dbData[i].happy -= 3;
                    //update lastPlayed to a time that is (lastPlayed time) - (9 hours) from the current time
                    dbData[i].lastPlayed = moment().subtract(momDifPlayed - 9, 'hours').format()
                }
                //if 6 hours have passed since lastPlayed
                else if (momDifPlayed >= 6) {
                    //subtract 2 from happy
                    dbData[i].dataValues.happy -= 2;
                    //update lastPlayed to a time that is (lastPlayed time) - (6 hours) from the current time
                    dbData[i].dataValues.lastPlayed = moment().subtract(momDifPlayed - 6, 'hours').format()
                }
                //if 3 hours have passed since lastPlayed
                else if (momDifPlayed >= 3) {
                    //subtract 1 from happy
                    dbData[i].dataValues.happy -= 1;
                    //update lastPlayed to a time that is (lastPlayed time) - (3 hours) from the current time
                    dbData[i].dataValues.lastPlayed = moment().subtract(momDifPlayed - 3, 'hours').format()
                };
                // =================================================================================
                //set statuses to zero if below zero
                // =================================================================================
                if (dbData[i].dataValues.hungry < 0) {
                    dbData[i].dataValues.hungry = 0;
                }
                if (dbData[i].dataValues.sleepy < 0) {
                    dbData[i].dataValues.sleepy = 0;
                }
                if (dbData[i].dataValues.happy < 0) {
                    dbData[i].dataValues.happy = 0;
                }
                // =================================================================================
                //Update hp and alive status
                // =================================================================================
                //hp and alive = 0 if all statuses are 0
                if (dbData[i].dataValues.hungry === 0 && dbData[i].dataValues.sleepy === 0 && dbData[i].dataValues.happy === 0) {
                    dbData[i].dataValues.hp = 0;
                    dbData[i].dataValues.alive = 0
                }
                //if 2 of the statuses are 0, set hp to 1
                else if (dbData[i].dataValues.hungry === 0 && dbData[i].dataValues.sleepy === 0 || dbData[i].dataValues.sleepy === 0 && dbData[i].dataValues.happy === 0 || dbData[i].dataValues.hungry === 0 && dbData[i].dataValues.happy === 0) {
                    dbData[i].dataValues.hp = 1
                }
                //if 1 status is 0, set hp to 2
                else if (dbData[i].dataValues.hungry === 0 || dbData[i].dataValues.sleepy === 0 || dbData[i].dataValues.happy === 0) {
                    dbData[i].dataValues.hp = 2
                }
                //if no statuses are 0, hp is full (3).
                else {
                    dbData[i].dataValues.hp = 3;
                }
            //push all of the altered data into an array which will be used to update the database
            petArray.push(dbData[i].dataValues)
        
            }
            // console.log("Ran timeUpdate")
            //return the newly updated data
            return petArray
        };
    });
   
    //update the columns depending on what was sent
    router.put("/api/pets/:id", function(req, res){
        
        var action = req.body.action;
        console.log(action)
        var actionKey;
        switch (action){
        // if Feed is sent then update hungry and lastFed to the current time
        case "Feed":
        // increment hungry by one
            db.Pet.findOne(
                {
                    where: {
                        id:req.params.id
                    }
                })
                .then(function(foundPet) {
                return foundPet.update({hungry: parseInt(foundPet.hungry)+1})
                })
                .then(function(result) {
                console.log("results: ", result)
                });
            // update the lastFed time
            db.Pet.update({

                lastFed: moment().format()
            },
                {
                    where: {
                        id: req.params.id
                    }
                })
                .then (function (result){
                    res.end()
                });
        // if hungry is at zero then increase hp by one
            if (req.body.hungry=0){
                db.Pet.findOne(
                    {
                        where: {
                            id:req.params.id
                        }
                    })
                    .then(function(foundPet) {
                    return foundPet.update({hp: parseInt(foundPet.hp)+1})
                    })
                    .then(function(result) {
                    console.log("results: ", result)
                    });
            }
            break;
        
        // if Play is sent then update happy and lastPlayed to the current time
        case "Play": 
            console.log("run play!!!")
            // increment happy by one
            db.Pet.findOne(
                {
                    where: {
                        id:req.params.id
                    }
                })
                .then(function(foundPet) {
                return foundPet.update({happy: parseInt(foundPet.happy)+1})
                })
                .then(function(result) {
                console.log("results: ", result)
                });
            // update the lastPlayed time
            db.Pet.update({
                lastPlayed: moment().format()
            },
                {
                    where: {
                        id: req.params.id
                    }
                })
                .then (function (result){
                    res.end()
                }); 
            // update hp if happy is 0
                if (req.body.happy=0){
                    db.Pet.findOne(
                        {
                            where: {
                                id:req.params.id
                            }
                        })
                        .then(function(foundPet) {
                        return foundPet.update({hp: parseInt(foundPet.hp)+1})
                        })
                        .then(function(result) {
                        console.log("results: ", result)
                        });
                }

            break;  
        
        // if Sleep is sent then update sleepy and lastSlept to the current time
        case "Sleep": 
            console.log("run sleep!!!")
            // increment Sleepy by one
            db.Pet.findOne(
                {
                    where: {
                        id:req.params.id
                    }
                })
                .then(function(foundPet) {
                return foundPet.update({sleepy: parseInt(foundPet.sleepy)+1})
                })
                .then(function(result) {
                console.log("results: ", result)
                });
            // update the lastSlept time
            db.Pet.update({
                lastSlept: moment().format()
            },
                {
                    where: {
                        id: req.params.id
                    }
                })
                .then (function (result){
                    res.end()                
                });  

            // increment hp if sleepy is 0
                if (req.body.sleepy=0){
                    db.Pet.findOne(
                        {
                            where: {
                                id:req.params.id
                            }
                        })
                        .then(function(foundPet) {
                        return foundPet.update({hp: parseInt(foundPet.hp)+1})
                        })
                        .then(function(result) {
                        console.log("results: ", result)
                        });
                }
                
            break; 
       
        // if Kill is sent then update all status to 0
        case "Kill": 
            console.log("run kill!!!")
            db.Pet.update({
                alive: 0,
                sleepy: 0,
                hungry: 0,
                happy: 0,
                hp: 0
            },
                {
                    where: {
                        id: req.params.id
                    }
                })
                .then (function (result){
                    res.end()                
                });
            break;

        case "Resurrect": 
            console.log("==========================run resurrect!!!=========================")
            db.Pet.update({
                alive: 1,
                sleepy: 5,
                lastSlept: moment().format(),
                hungry: 5,
                lastFed: moment().format(),
                happy: 5,
                lastPlayed: moment().format(),
                hp: 3
            },
                {
                    where: {
                        id: req.params.id
                    }
                })
                .then (function (result){
                    res.end()                
                });
            break;
    }
    
    });
// };

//export router
module.exports = router
