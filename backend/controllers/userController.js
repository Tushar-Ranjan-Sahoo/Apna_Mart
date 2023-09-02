const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");


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
    sendToken(user,201,res);
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
   sendToken(user,200,res);
});


// user log out
exports.logout = catchAsyncErrors(async(req, res, next) => {
    
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success:true,
        message: "User logged out"
    });
});

exports.forgetPassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHander("user not found",404));
    }
    //get ResetPassword token
   const resetToken=user.getResetPasswordToken();

   await user.save({validateBeforeSave:false});

   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message =`Your password reset token is :- \n\n ${resetPasswordUrl}\n\nif you have not requested this email then please ignore it `;
    try {
            await sendEmail({
                email: user.email,
                subject: `ApnaMart password recovery `,
                message,
            });

            res.status(200).json({
                success : true,
                message : `Email sent to ${user.email} successfully`,
            });

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave:false});

        return next(new ErrorHander(error.message,500));

    }
});