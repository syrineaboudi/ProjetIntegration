module.exports = app => {
    const category = require("../controllers/category.controller.js");
    const { authJwt } = require("../middlewares");
    var router = require("express").Router();
  
    // Create a new Category
    router.post("/createcategory",[authJwt.verifyToken, authJwt.isAdmin], category.createCategory);
  
    // Retrieve all category
    router.get("/findallcategory", [authJwt.verifyToken, authJwt.isAdmin],category.findAllCategory);
  
    // Retrieve all published category
    router.get("/published",[authJwt.verifyToken, authJwt.isAdmin],category.findAllPublished);
  
    // Retrieve a single category with id
    router.get("/findonecategory/:id",[authJwt.verifyToken, authJwt.isAdmin], category.findOneCategory);
  
    // Update a category with id
    router.put("/updatecategorybyid/:id",[authJwt.verifyToken, authJwt.isAdmin], category.updateCategoryById);
  
    // Delete a category with id
    router.delete("/deletecategorybyid/:id",[authJwt.verifyToken, authJwt.isAdmin], category.deleteCategoryById);
  
    // Delete all category
    router.delete("/deleteallcategory/",[authJwt.verifyToken, authJwt.isAdmin], category.deleteAllCategory);
    
    // Update status category
    router.put("/updatestatuscategory/:id/status", [authJwt.verifyToken, authJwt.isAdmin],category.updateStatusCategory);
  
    app.use('/api/category', router);
  };