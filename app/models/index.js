const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.reclamations = require("./reclamation.model.js")(mongoose);
db.notification = require("./notification.model.js")(mongoose);
db.reponses = require("./reponse.model.js")(mongoose);
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
