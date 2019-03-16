
// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var exphbs = require("express-handlebars");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));


//For express and handlebars to talk to each others
// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// all the handlebars are in the ‘view’ folder, the following path will look for handlerbar in this folder
app.set("view engine", "handlebars");



// // Routes
// // =============================================================
// // require("./routes/html-routes.js")(app);
// require("./routes/users-api-routes.js")(app);
// require("./routes/pets-api-routes.js")(app);
// require("./routes/html-routes.js")(app);


// Routes with router
// // =============================================================

// Import routes and give the server access to them.
var petRoutes = require("./routes/pets-api-routes");
var userRoutes = require("./routes/users-api-routes.js");
var htmlRoutes = require("./routes/html-routes.js")
var protectedRoutes = require("./routes/protected-routes")

// use the routes
app.use(petRoutes);
app.use(userRoutes);
app.use(htmlRoutes);
app.use(protectedRoutes);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync()
  .then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
});