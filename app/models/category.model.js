module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: { type: String, required: true },
            description: { type: String, required: true },
            status: { type: Boolean, default: true },
        }

    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Category = mongoose.model("Category", schema);


    return Category;
};