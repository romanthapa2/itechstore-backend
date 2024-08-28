const mongooes = require("mongoose");
require('dotenv').config();
const dburl=process.env.MONGO_DB_URL;


const connectToMongoo = async () => {
  try {
    mongooes.connect(dburl);
    console.log("connected to monogooes succesfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports=connectToMongoo;