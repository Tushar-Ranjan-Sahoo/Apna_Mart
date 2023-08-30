const express = require('express');
const { getAllproducts, createProduct ,updateProduct,deleteProduct,getProductDetainls} = require('../controllers/productController');
const { isAutjenticatedUser } = require('../middleware/auth');

const router = express.Router();


router.route("/products").get(isAutjenticatedUser, getAllproducts);
router.route("/products/new").post(createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getProductDetainls)

module.exports = router