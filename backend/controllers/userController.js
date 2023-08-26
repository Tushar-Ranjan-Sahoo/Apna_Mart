const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");


//Register a user 

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
         name,
         email,
         password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicurl",
        },
    });
    const token = user.getJWTToken();
    res.status(200).json({
        sucess: true,
        token,
    });
});

//Login a user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    // checking if user  has given email and password
    if(!email || !password) {
        return next(new ErrorHandler(" Please Enter Email & Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const token = user.getJWTToken();
    res.status(200).json({
        sucess: true,
        token,
    });
})