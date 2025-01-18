const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const error = require("../middleware/error");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");



// Register a user

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width:150,
        crop: "scale",
    });

    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });
   
    sendToken(user,201,res);
   
});


// login User

exports.loginUser = catchAsyncErrors(async (req,res,next) =>{
    const { email,password } = req.body;

    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please vai email and password daal",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

   const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
 
});


/// logout user -->

exports.logout = catchAsyncErrors(async (req,res,next) =>{
    res.cookie("token",null,{
        expire:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged out",
    });
});


// forget Password

exports.forgetPassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findOne({email:req.body.email});

   if(!user){
    return next(new ErrorHandler("User not found",404));
   }

   // Get ResetPassword Token
   const resetToken = user.getResetPasswordToken();

   await user.save({ validateBeforeSave:false});

   // genrating link through whc we send email

   const resetPasswordUrl = `${process.env.FRONTEND_URL}/api/vi/password/reset/${resetToken}`;
   
   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested ths email
   then, please ignore it.`;

   try{
         
        await sendEmail({
           email:user.email,
           subject:`YouMatters Password Recovery`,
           message, 
            
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });

   } catch (err){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500))
   }

});

/// Reset Password

exports.resetPassword = catchAsyncErrors(async(req,res,next) =>{

  // creating token hash
  
  const resetPasswordToken = crypto.createHash("sha256")
  .update(req.params.token).digest("hex");


  const user = await user.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now() },
  });

  if(!user){
    return next(new ErrorHandler("Reset Password Token is Invalid or has been eexpired", 400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not password" , 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;


  await user.save();

  sendToken(user, 200, res);

});


// GEt User Details

exports.getUserDetails = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});


/// Update User Password

exports.updatePassword = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password dose not match",400))
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

   
});
   
// update User Profile

exports.updateProfile = catchAsyncErrors(async (req,res,next) =>{
  
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };
     
     //  adding cloudinary
     
     if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url:myCloud.secure_url,
        };

     }


      const user  = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
      });

      
      res.status(200).json({
        success:true,
      });

   
});


// Get all users(Admin)

exports.getAllUser = catchAsyncErrors(async (req,res,next) =>{
 
     const users = await User.find();

     res.status(200).json({
        success:true,
        users
     })
});


// Get single users(admin)

exports.getSingleUser = catchAsyncErrors(async (req,res,next) =>{
 
    const user = await User.findById(req.params.id);
    
   if(!user){
    return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
   }

    res.status(200).json({
       success:true,
       user
    })
});


/// Update user role --Admin

exports.updateUserRole = catchAsyncErrors(async (req,res,next) =>{
  
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    };
     
      await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
      });

      
      res.status(200).json({
        success:true,
      });

   
});


// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next) =>{
  
     const user = await User.findById(req.params.id);

     if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
     }

     const imageId = user.avatar.public_id;
     await cloudinary.v2.uploader.destroy(imageId);

     await user.remove();
      
      res.status(200).json({
        success:true,
        message: "User is Deleted successfully",
      });

   
});
