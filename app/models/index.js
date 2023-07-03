const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");

db.role = require("./role.model");

db.products = require("./product.model.js")(mongoose);

db.category = require("./category.model.js")(mongoose);

db.dashboards = require("./dashboard.model.js")(mongoose);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;