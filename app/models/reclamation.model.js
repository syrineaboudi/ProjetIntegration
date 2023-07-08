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
      employee: {
        type: mongoose.Schema.Types.ObjectId, // Utilisation d'ObjectId pour représenter l'employé
        ref: 'User', // Référence à la collection d'utilisateurs
        required: false // À ajuster en fonction de votre logique métier
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
