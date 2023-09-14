const express = require('express');
const { getAllproducts, createProduct ,updateProduct,deleteProduct,getProductDetainls, createProductReview, deleteReview, getProductReviews} = require('../controllers/productController');
const { isAutjenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route("/products").get( getAllproducts,);
router.route("/admin/products/new").post(isAutjenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/admin/products/:id").put(isAutjenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAutjenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/products/:id").get(getProductDetainls);

router.route("/review").put(isAutjenticatedUser,createProductReview);
router
    .route("/review")
    .get(getProductReviews)
    .delete(isAutjenticatedUser,deleteReview);

module.exports = router