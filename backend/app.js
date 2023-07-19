const express = require('express');
const app = express();
const errorMiddleware = require("./middleware/error");
app.use(express.json());
// Route Imports

const productRouter = require("./routes/ProductRoute");
const user = require("./routes/userRoute");

app.use("/api/v1", productRouter);
app.use("/api/v1",user);

//middleware for errors
app.use(errorMiddleware)

module.exports=app