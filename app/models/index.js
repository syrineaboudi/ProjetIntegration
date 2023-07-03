const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.reclamations = require("./reclamation.model.js")(mongoose);
db.notification = require("./notification.model.js")(mongoose);
db.reponses = require("./reponse.model.js")(mongoose);

module.exports = db;
