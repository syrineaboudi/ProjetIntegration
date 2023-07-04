module.exports = (app) => {
  const reclamations = require("../controllers/reclamation.controller.js");

  var router = require("express").Router();

  //ajout new Reclamation
  router.post("/createReclamation", reclamations.createReclamation);

  router.post("/", reclamations.create);
  
  // listeReclamation
  router.get("/all", reclamations.findAll);
  router.get("/findAllreclamationsNot", reclamations.findAllreclamationsNot);

  // liste Reclamation accpete
  router.get("/published", reclamations.findAllPublished);

  //  affichage Reclamation avec id
  router.get("/test/:id", reclamations.findOne);

  // Update  Reclamation avec id
  router.put("/update/:id", reclamations.update);

  // Delete  Reclamation avec id
  router.delete("/deleteReclamation/:id", reclamations.delete);

  // Delete tt Reclamation
  router.delete("/", reclamations.deleteAll);

  //findAllSortedByCreationDate
  
  router.get("/sorted-by-creation-date",reclamations.findAllSortedByCreationDate);
    //findAllSortedBychampChoisi

  router.get("/tri/:champTri", reclamations.trierReclamations);
      //findStatistiquePubReclamation

  router.get("/statistiques/traite", reclamations.statistiqueTraite);

  app.post('/message/:id', reclamations.sendMessage);
  
  app.use("/api/reclamations", router);
};
