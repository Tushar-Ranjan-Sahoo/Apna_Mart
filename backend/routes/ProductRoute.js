const express = require('express');
const { getAllproducts, createProduct ,updateProduct} = require('../controllers/productController');

const router = express.Router();


router.route("/products").get(getAllproducts);
router.route("/products/new").post(createProduct);
router.route("/products/:id").put(updateProduct);

module.exports = router