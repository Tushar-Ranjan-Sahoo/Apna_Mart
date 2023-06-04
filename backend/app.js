const express = require('express');
const app = express();

app.use(express.json());
// Route Imports

const productRouter = require("./routes/ProductRoute");
app.use("/api/v1", productRouter);

module.exports=app