module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      client: String,
      email: String,
      numero_telephone: String,
      Status: {
        type: Boolean,
        default: false,
      },
      reponse_message: String,
      image: String,
      type: String,
      description: String,
      traite: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Reclamation = mongoose.model("reclamation", schema);
  return Reclamation;
};
