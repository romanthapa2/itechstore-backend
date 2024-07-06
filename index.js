const dotenv = require('dotenv');
dotenv.config();
const connectToMongoDB = require('./db');
const app = require("./app")


connectToMongoDB()
.then(()=>{
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})
.catch((err)=>{
  console.log('Failed to connect to MongoDB', err);
})
