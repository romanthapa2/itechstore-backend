const mongooes = require("mongoose");
require('dotenv').config();
const dburl=process.env.REACT_APP_API_URL;
const mongourl =dburl;

//this function helps to connect to the mangodb database through the url
const connectToMongoo = async () => {
  try {
    mongooes.connect(mongourl);
    console.log("connected to monogooes succesfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToMongoo;