const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const  newOrder  = require("../controllers/orderController");


router.post("/order/new",newOrder) ;


module.exports = router;