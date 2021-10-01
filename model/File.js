const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    imagesArray: {
      type: Array,
    },
  },
  {
    collection: "files",
  }
);
// export model user with UserSchema
module.exports = mongoose.model("File", fileSchema);
