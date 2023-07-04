module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            categoryCount: Number,
            productCount: Number,
            userCount: Number,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Dashboard = mongoose.model("dashboard", schema);

    return Dashboard;
};