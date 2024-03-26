const connectToMongoo=require('./db');
const express = require('express')
var cors=require("cors");

connectToMongoo();
const app = express()
const port = 5000


app.use(cors())
app.use(express.json())
// When a request with URL-encoded data(like data submitted by form eg.of url ecoded data name=John%20Doe&age=30)
//  is received by the Express application, this middleware will parse the data and make it available
// in the req.body object of the corresponding route handlers.
app.use(express.urlencoded({extended:false}));
const admin=require("./routes/Admin")
app.use('/api/admin',admin)
// If a file with the requested path exists in the uploads directory, Express will serve it back
// to the client.
// This setup allows you to serve static files like images or other assets directly to clients 
// without needing to write specific routes for each file. It's a convenient way to handle serving
//  static content in your web application.
app.use('/uploads', express.static('uploads'));
// for user login and signup
const user=require("./routes/auth")
app.use('/auth',user)


app.listen(port, () => {
  console.log(`inotebook backend listening on port http://localhost:${port}`)
})