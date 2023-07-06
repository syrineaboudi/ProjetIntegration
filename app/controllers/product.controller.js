const db = require("../models");
const Product = db.products;
const Category = db.category;

// Create and Save a new Product
exports.createProduct = async (req, res) => {
    const { name, categoryName, description, price, priceDiscount, quantity, status } = req.body;
    // Validate request
    if (!name || !description || !price || !quantity) {
        res.status(400).send({ message: "Content of product can not be empty!" });
        return;
    }
    try {
        // Check if the categoryId exists
        const existingCategory = await Category.findOne({ name: categoryName });
        if (!existingCategory) {
            return res.status(400).json({ error: "Category does not exist" });
        }

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(400).json({ error: req.body.name + ' ' + 'already exists' });
        }

        var arrImages = [];
        for (let i = 0; i < req.files.length; i++) {
            arrImages[i] = req.files[i].filename;
        }

        var newProduct = new Product({
            name,
            category: existingCategory._id,
            description,
            price,
            priceDiscount,
            quantity,
            images: arrImages,
            status: true, // Assuming status is always true when adding a product

        });

        // Save the new product to the database
        newProduct.save()
            .then(savedProduct => {
                // res.send(savedProduct);
                res.status(200).json({ message: 'Product Added successfully', savedProduct });
            })
            .catch(err => {
                console.error('Error adding product', err);
                res.status(500).json({ error: 'Check product values' });
            });
    } catch (error) {
        res.status(400).send({ sucess: false, msg: 'Error' });
    }

};


// Retrieve all Product from the database.
exports.findAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ category: { $ne: null } }).populate('category', 'name');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Retrieve all Product from the database.
exports.getAllProductsByCategory = (req, res) => {

    Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'Category'
            }
        },
        {
            $unwind: '$category' // Corrected field name to 'Category'
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                price: 1,
                priceDiscount1,
                quantity: 1,
                status: 1,
                categoryId: '$Category._id', // Corrected field name to 'Category'
                categoryName: '$Category.name' // Corrected field name to 'Category'
            }
        }
    ])
    .then(products => {
        res.json(products);
    })
    .catch(err => {
        console.error('Error retrieving products with category details', err);
        res.status(500).json({ error: 'Internal server error' });
    });
};
// Find a single Product with an id
exports.findOneProduct = (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Product with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Tutorial with id=" + id });
        });
};

// Update a Product by the id in the request
exports.updateProductById = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try { 
        const productId = req.params.id;
        const { name, description, price, priceDiscount ,quantity, category } = req.body;

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product fields
        if (name) {
            product.name = name; 
        }
        if (description) {
            product.description = description;
        }
        if (price) {
            product.price = price;
        } 
        if (priceDiscount) {
            product.priceDiscount = priceDiscount;
        }
        if (quantity) {
            product.quantity = quantity;
        }

        // Update the category field
        if (category) {
            // Assuming the category field is a reference to the Category model
            // First, find the category by name or any unique identifier
            const foundCategory = await Category.findOne({ nameC: category});
            if (foundCategory) {
                // If the category exists, update the reference in the product
                product.category = foundCategory._id; 
            } else {
                // If the category doesn't exist, you may choose to create a new one or handle it as required.
                // For example:
                throw new Error('Category not found');
            }
        }

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a Product with the specified id in the request
exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndRemove(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete all Products from the database.
exports.deleteAllProducts = (req, res) => {
    Product.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Products were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Products."
            });
        });
};

// Find all Status active Products
exports.findAllProductsActive = (req, res) => {
    Product.find({ status: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving products."
            });
        });
};

// Find all Status active Products
exports.findAllProductsNonActive = (req, res) => {
    Product.find({ status: false })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving products."
            });
        });
};

// Update a Product by the id in the request
exports.updateStatusProduct = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    const newStatus = req.body.status;

    // Update the product's status
    Product.findByIdAndUpdate(id, { status: newStatus }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated status successfully', updatedProduct });
        })
        .catch(err => {
            console.error('Error updating product status', err);
            res.status(500).json({ error: 'Error updating Product status with id=' + id });
        });
}

exports.getProductByCategory = (req, res) => {
    const categoryId = req.params.id;

    Product.find({ categoryId: categoryId, status: true })
        .select('id name description price quantity images status')
        .then(products => {
            res.json(products);
        })
        .catch(err => {
            console.error('Error retrieving products by category ID', err);
            res.status(500).json({ error: 'Category not found' });
        });
}


exports.ratingProductPlus = async (req, res) => {
    const productId = req.params.id;
    const rating = req.body.rating;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the new average rating
        const newRating = ((product.rating * product.numRatings) + rating) / (product.numRatings + 1);

        product.rating = newRating;
        product.numRatings += 1;

        const numRatings = product.numRatings;

        await product.save();

        res.json({ message: 'Product rating updated successfully', numRatings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.ratingProductMin = async (req, res) => {
    const productId = req.params.id;
    const rating = req.body.rating;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the new average rating
        const newRating = ((product.rating * product.numRatings) + rating) / (product.numRatings - 1);

        product.rating = newRating;
        product.numRatings -= 1;

        const numRatings = product.numRatings;

        await product.save();

        res.json({ message: 'Product rating updated successfully', numRatings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.productStock = async (req, res) => {
    const productId = req.params.id;
    const requestedQuantity = req.body.quantity;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity >= requestedQuantity) {
            // Sufficient stock available, process the order
            product.quantity -= requestedQuantity;
            await product.save();
            res.json({ message: 'Order processed successfully' });
        } else {
            // Stock rupture, insufficient quantity available
            res.status(400).json({ message: 'Stock rupture: Insufficient quantity available' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.featuredProduct = async (req, res) => {
    const count = req.params.count || 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
        return res.status(404).json({ message: 'Product not found' });
    }
    //res.status(500).json({ sucess: false })
    res.send(products)

};

// Uupdate Featured Product 
exports.updateFeaturedProduct = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    const newFeatured = req.body.isFeatured;

    // Update the product's status
    Product.findByIdAndUpdate(id, { isFeatured: newFeatured }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated featured successfully', updatedProduct });
        })
        .catch(err => {
            console.error('Error updating product featured', err);
            res.status(500).json({ error: 'Error updating Product featured with id=' + id });
        });
}