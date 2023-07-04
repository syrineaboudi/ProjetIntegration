module.exports = app => {
    const dashboard = require("../controllers/dashboard.controller.js");
  
    var router = require("express").Router();
  
    // Details of dashboard
    router.get("/details", dashboard.details);

  
    app.use('/api/dashboard', router);
  };