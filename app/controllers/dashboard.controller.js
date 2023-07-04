const db = require("../models");
const Dashboard = db.dashboard;
const Category = db.category;
const Product = db.products;

// details of Dashboard
exports.details = (req, res) => {
    let categoryCount;
    let productCount;
    let userCount;

    Category.countDocuments()
        .then(count => {
            categoryCount = count;
            console.log('categoryCount:', categoryCount);

            return Product.countDocuments();
        })
     /*    .then(count => {
            productCount = count;
            console.log('productCount:', productCount);

            return User.countDocuments();
        }) */
        .then(count => {
            productCount = count;
            console.log('productCount:', productCount);

            const data = {
                category: categoryCount,
                product: productCount,
                //user: userCount
            };

            res.status(200).json(data);
        })
        .catch(err => {
            console.error('Error retrieving counts', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};

