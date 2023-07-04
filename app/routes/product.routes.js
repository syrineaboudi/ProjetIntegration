module.exports = app => {
    const products = require("../controllers/product.controller.js");

    const multer = require("multer");
    const path = require("path");



    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/productImages'), function (err, success) {
                if (err) {
                    throw err
                }
            });
        },
        filename: function (req, file, cb) {
            const name = Date.now() + '-' + file.originalname;
            cb(null, name, function (error, success) {
                if (error) {
                    throw error
                }
            });
        }
    });
    
    const upload = multer({ storage: storage });

    var router = require("express").Router();

    // Create a new Product
    router.post("/createproduct",  upload.array('images'), products.createProduct);

    // Retrieve all Products
    router.get("/getallproducts", products.findAllProducts);

    // Retrieve all Products
    router.get("/getallproductsbycategory", products.getAllProductsByCategory);

    // Retrieve all status active Products
    router.get("/findallproductsactive", products.findAllProductsActive);

    // Retrieve all status active Products
    router.get("/findallproductsnonactive", products.findAllProductsNonActive);

    // Retrieve a single Product with id
    router.get("/findoneproduct/:id", products.findOneProduct);

    // Update a Product with id
    router.put("/updateproductbyid/:id", products.updateProductById);

    // Delete a Product with id
    router.delete("/deleteproductbyid/:id", products.deleteProductById);

    // Delete all Products
    router.delete("/deleteallproducts", products.deleteAllProducts);

    // Update status product
    router.put("/updatestatusproduct/:id/status", products.updateStatusProduct);

    // get Product By Category product
    router.get("/getproductbycategory/:id", products.getProductByCategory);

    // + Rating  Product 
    router.put("/ratingproductmax/:id/rating", products.ratingProductPlus);

    // - Rating  Product 
    router.put("/ratingproductmin/:id/rating", products.ratingProductMin);

    // - Rating  Product 
    router.put("/productstock/:id/order", products.productStock);

    // - Featured Product 
    router.get("/featuredproduct/:count", products.featuredProduct);

     // Update Featured product
     router.put("/updatefeaturedproduct/:id/featured", products.updateFeaturedProduct);



    app.use('/api/products', router);
};