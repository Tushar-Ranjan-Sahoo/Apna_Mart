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
exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
    const resetPasswordToken = Crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now},
});
if(!user){
    return next(new ErrorHander("reset password token is invalid or has been expired",404));
}
if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHander("password does  not match ",400));

}
user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();
sendToken(user,200,res);
});

// get user details
exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });


});

// update User password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("old password is incoorect",400));

    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("password does not match", 400));

    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);

});

// update User profile

exports.updateProfile = catchAsyncErrors(async(req,res,next) =>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    // later adding images

    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,

    });
});

//get all user (admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});

// get single users(admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user  = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHander(`user does not exist with id: ${req.params.id}`)
        );
    }
    res.status(200).json({
        success:true,
        user,
    });
});
// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  // delete user -- admin

  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(
            new ErrorHander(`User does not exist with id : ${req.params.id}`,400)

        );
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message: "user deleted successfully",
    });
  });
