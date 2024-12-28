import mongoose from "mongoose";

const connectToDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to Database");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/bgRemoval`);
};

export default connectToDB;
