const express = require('express');
const { getAllproducts, createProduct ,updateProduct,deleteProduct,getProductDetainls} = require('../controllers/productController');
const { isAutjenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route("/products").get( getAllproducts,);
router.route("/products/new").post(isAutjenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/products/:id").put(isAutjenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAutjenticatedUser,authorizeRoles("admin"),deleteProduct).get(getProductDetainls)

module.exports = router