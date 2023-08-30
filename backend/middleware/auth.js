const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAutjenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
   if (!token){
    return next(new ErrorHander("please login to accress this resource",401));
   }
   const decodeddData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodeddData.id);
    next();
}) ;