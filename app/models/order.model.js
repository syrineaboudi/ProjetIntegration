module.exports = (mongoose) => {

    var Schema = mongoose.Schema(
        {
            name: { type: String, required: true },
            address: { type: String, required: true },
            addressLatLng: { type: mongoose.Schema.Types.ObjectId, ref: 'LatLng', required: true },
            NumTelephone: { type: String, required: true },
            paymentId: { type: String },
            totalPrice: { type: Number, required: true },
            items: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'orderItem',
                required: true,
            }],

            status: { type: String, enum: ['New', 'Done'], default: 'New' },
        },
        { timestamps: true }
    )

    Schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    Schema.method("getResponseTime", function () {
        const responseTime = this.updatedAt - this.createdAt;
        return responseTime;
      });

    const Order = mongoose.model('Order', Schema);

    return Order;
};