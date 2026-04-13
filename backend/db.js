// this database , db.js connects to mongoDb instance, yaha pe ek schema hai,
//schema ka model hai

const mongoose = require("mongoose");

//a cleaner way to write code , with feedback
//we are connecting the mongoose to our database.
const connectToMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:10001/?replicaSet=rs0&directConnection=true",
    );
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
// DON'T FORGET TO CALL IT:
connectToMongo();
//creating user schema, basically our model !

//firstName , lastName , password
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      minLenght: 3,
      maxLenght: 20,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      minLenght: 2,
      maxLenght: 30,
    },
    lastName: {
      type: String,
      required: true,
      minLenght: 2,
      maxLenght: 30,
    },
  },
  {
    timestamps: true,
  },
);

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
const Accounts = mongoose.model("Accounts", accountSchema);
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  Accounts,
};
