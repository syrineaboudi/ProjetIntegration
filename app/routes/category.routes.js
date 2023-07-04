module.exports = app => {
    const category = require("../controllers/category.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Category
    router.post("/createcategory", category.createCategory);
  
    // Retrieve all category
    router.get("/findallcategory", category.findAllCategory);
  
    // Retrieve all published category
    router.get("/published", category.findAllPublished);
  
    // Retrieve a single category with id
    router.get("/findonecategory/:id", category.findOneCategory);
  
    // Update a category with id
    router.put("/updatecategorybyid/:id", category.updateCategoryById);
  
    // Delete a category with id
    router.delete("/deletecategorybyid/:id", category.deleteCategoryById);
  
    // Delete all category
    router.delete("/deleteallcategory/", category.deleteAllCategory);
    
    // Update status category
    router.put("/updatestatuscategory/:id/status", category.updateStatusCategory);
  
    app.use('/api/category', router);
  };