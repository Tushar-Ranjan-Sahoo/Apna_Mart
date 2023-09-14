const express = require('express');
const { registerUser,loginUser, logout, forgetPassword, resetPassword, getUserDetails ,updatePassword,updateProfile,getSingleUser,getAllUsers, updateUserRole,deleteUser} = require('../controllers/userController');

const {isAutjenticatedUser,authorizeRoles} = require('../middleware/auth')

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser); 

router.route("/password/forgot").post(forgetPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAutjenticatedUser,getUserDetails);

router.route("/password/update").put(isAutjenticatedUser,updatePassword);

router.route("/me/update").put(isAutjenticatedUser,updateProfile);

router.route("/admin/users").get(isAutjenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/admin/users/:id").get(isAutjenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAutjenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAutjenticatedUser,authorizeRoles("admin"),deleteUser);


module.exports = router;
