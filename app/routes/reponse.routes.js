module.exports = (app) => {
    const reponses = require("../controllers/reponse.controller");
  
    var router = require("express").Router();
  
    router.post("/send", reponses.sendEmail);
    app.use("/api/reponses", router);
};
