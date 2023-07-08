const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  var router = require("express").Router();
  
  router.get("/api/test/all", controller.allAccess);

  router.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  router.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  router.get(
    "/api/test/admin",
    [authJwt.verifyToken],
    controller.adminBoard
  );

  router.get("/findAll",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );

  router.put("/updateStatusUser/:id/status",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateStatusUser
  );

  router.delete("/deleteUserById/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUserById
  )
  router.put("/updateUserById/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUserById
  )



  app.use('/api/users', router);
  


};

