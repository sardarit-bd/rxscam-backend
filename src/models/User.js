import mongoose from "mongoose";


/*************** Define the schema Here ****************/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user", "provider"],
      default: "user"
    },
    phone: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
      lowercase: true
    },
    zipcode: {
      type: String,
      default: "",
      lowercase: true
    },
    address: {
      type: String,
      default: '',
      lowercase: true
    },
    address2: {
      type: String,
      default: '',
      lowercase: true
    },

    maxCatagorySelect: {
      type: Number,
      default: 10,
      min: 1,
      max: 50,
    },

    maxAreaSelect: {
      type: Number,
      default: 10,
      min: 1,
      max: 50,
    },

    isUpdated: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);



/************** Create model from schema Here ****************/
const User = mongoose.models.User || mongoose.model("User", userSchema);



/************** module export from  here **************/
export default User;
