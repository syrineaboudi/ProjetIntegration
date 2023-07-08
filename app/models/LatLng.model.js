module.exports = (mongoose) => {
    var LatLngSchema = mongoose.Schema(
        {
            lat: { type: String, required: true },
            lng: { type: String, required: true }
        }
    )
    LatLngSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const LatLng = mongoose.model("LatLng", LatLngSchema);
    return LatLng;
}