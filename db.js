const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://CrimsonLair:soham234@atlascluster.ezoivhu.mongodb.net/";

const connectToMongo = async () =>{
    await mongoose.connect(mongoURI)
    console.log("Connected to MongoDB.");
}

module.exports = connectToMongo;