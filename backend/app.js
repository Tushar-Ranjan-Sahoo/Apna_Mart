const express = require('express');
const app = express();
const errorMiddleware = require("./middleware/error");
app.use(express.json());
// Route Imports

const productRouter = require("./routes/ProductRoute");
app.use("/api/v1", productRouter);

//middleware for errors
app.use(errorMiddleware)

module.exports=app