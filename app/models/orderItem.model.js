module.exports = (mongoose) => {
    var OrderItemSchema = mongoose.Schema(
      {
        quantite: {
          type: Number,
          required: true
        },
        Product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }
  
      }
      ,
      { timestamps: true }
    )
    OrderItemSchema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
  
    const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
    return OrderItem;
  }