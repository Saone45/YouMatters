const ErrorHandler = require("../utils/errorHandler");


module.exports = (err,req,res,next)=>{

   err.statusCode = err.statusCode || 500;
   err.message = err.message || "Interal Server Error" ;

   // wrong mongodb id error
   
   if(err.name === "CastError"){
    const message = `Resource not found. Galat hai app . Invalid ${err.path} `;
    err = new ErrorHandler(message,400);
   }


    /// Mongoose duplicate key error
    if(err.code === 11000){
      const message = `Duplicate ${Object.keys(err.keyvalue)} Enteren `;
      err = new ErrorHandler(message,400);
    }

    // Wrong Jwt error
    if(err.code === "jsonWebTokenError"){
      const message = `Json Web Token is invalid , try again `;
      err = new ErrorHandler(message,400);
    }

    // Jwt EXPIRE error
    if(err.code === "TokenExpiredError"){
      const message = `Json Web Token is Expired , try again `;
      err = new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
    success:false,
    message:err.message,
   })
}