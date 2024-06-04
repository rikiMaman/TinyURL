import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  links: [{
    type: Schema.Types.ObjectId, ref: 'Link'
  }]
});
const User = mongoose.model("user", userSchema);
export default mongoose.model("user", userSchema);