module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        reclamation:   {type: mongoose.Schema.Types.ObjectId,
        ref: 'reclamations'},
        id_user:String,
        subject:String,
        text: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
     
    const Reponse = mongoose.model("reponse", schema);
    return Reponse;
  };
  