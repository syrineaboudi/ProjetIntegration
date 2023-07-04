const db = require("../models");

const Category = db.category;

// Create and Save a new Category
exports.createCategory = async (req, res) => {

    const { name , description } = req.body;
    // Validate request
    if (!name || !description ) {
        res.status(400).send({ message: "Content of Category cannot be empty!" });
        return;
    }
    try {
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ error: req.body.name + ' already exists' });
        }

        var newCategory = new Category({
            name,
            description,
            status: true,
        });

        // Save the new Category to the database
        newCategory.save()
            .then(savedCategory => {
                // res.send(savedProduct);
                res.status(200).json({ message: 'Category Added successfully', savedCategory });
            })
            .catch(err => {
                console.error('Error adding Category', err);
                res.status(500).json({ error: 'Check Category values' });
            });
    } catch (error) {
        res.status(400).send({ sucess: false, msg: 'Category does not exist' });
    }

};

// Retrieve all Category from the database.
exports.findAllCategory = (req, res) => {

    // find by name 
    const name = req.query.name;
    var condition = name ? { title: { $regex: new RegExp(name), $options: "i" } } : {};

    Category.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving category."
            });
        });
};
// Find a single Category with an id
exports.findOneCategory = (req, res) => {
    const id = req.params.id;

    Category.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Category with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Category with id=" + id });
        });
};

// Update a Category by the id in the request
exports.updateCategoryById = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try {
        const categoryId = req.params.id; 
        const { name } = req.body;
        const { description } = req.body;

        // Find the Category by ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the Category fields
        if (name) {
            category.name = name;
        }
        if (description) {
            category.description = description;
        }

        // Save the updated Category
        await category.save();

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a Category with the specified id in the request
exports.deleteCategoryById = (req, res) => {
    const id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
                });
            } else {
                res.send({
                    message: "Category was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Category with id=" + id
            });
        });
};

// Delete all Category from the database.
exports.deleteAllCategory = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// Find all published Category
exports.findAllPublished = (req, res) => {
    Category.find({ status: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Category."
            });
        });
};

// Update a Category by the id in the request
exports.updateStatusCategory = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    const newStatus = req.body.status;

    // Update the product's status
    Category.findByIdAndUpdate(id, { status: newStatus }, { new: true })
        .then(updatedCategory => {
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated status successfully', updatedCategory });
        })
        .catch(err => {
            console.error('Error updating Category status', err);
            res.status(500).json({ error: 'Error updating Category status with id=' + id });
        });
}


