module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            priceDiscount: { type: Number },
            quantity: { type: Number, required: true },
            status: { type: Boolean, default: true },
            images: { type: Array, required: true, validate: [arrayLimite, 'You can pass only 5 product images'] },
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
            rating: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            numRatings: {
                type: Number,
                default: 0
            },
            isFeatured: {
                type: Boolean,
                default: false,
            }
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    function arrayLimite(val) {
        return val.length <= 5;
    }

    const Product = mongoose.model("Product", schema);

    return Product;
};