const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary")




/// create product -- Admin
 exports.createProduct = catchAsyncErrors(async (req,res,next)=>{
   
  let images = [];

  if(typeof req.body.images === "string") {
   images.push(req.body.images);
  } else {
   images = req.body.images;
  }

  const imagesLinks = [];

  for(let i = 0; i< images.length; i++) {
   const result = await cloudinary.v2.uploader.upload(images[i] , {
      folder: "products",
   });

   imagesLinks.push({
      public_id:result.public_id,
      url:result.secure_url,
   });
  }


   req.body.images = imagesLinks;
   req.body.user = req.user.id;  //add user id to the request body from auth middleware

   const product = await Product.create(req.body);

   res.status(201).json({
       success:true,
       product,
   });
});
 2

 // get All product
 exports.getAllProducts = catchAsyncErrors(async (req,res,next)=>{
   // return next(new ErrorHandler("This is my temp error",500))
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

   const apiFeature = new ApiFeatures(Product.find(),req.query)
       .search()
       .filter()
       
       let products = await apiFeature.query;

       let filteredProductsCount = products.length;

       products = await apiFeature.query;
   
 
    res.status(200).json({
       success:true,
       products,
       productsCount,
       resultPerPage,
       filteredProductsCount,
    });
 });


  // get All product (admin)
  exports.getAdminProducts = catchAsyncErrors(async (req,res,next)=>{
 
     const products = await Product.find();
     
    res.status(200).json({
       success:true,
       products,
    });
 });
 
 
// Get Product Details-->

exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{

   const product = await Product.findById(req.params.id);

   if(!product){
      return next(new ErrorHandler("product not found",404));
      
   }

   res.status(200).json({
      success:true,
      product,
     

   });
});


 // update product -- Admin

 exports.updateProduct = catchAsyncErrors(async (req,res,next) =>{

   let product = await Product.findById(req.params.id);
      
      if(!product){

      return next(new ErrorHandler("product not found",404));
      }

       // Images Start Here
       let images = [];

       if(typeof req.body.images === "string") {
         images.push(req.body.images);
       } else { 
         images = req.body.images;
       }

       if(images !== undefined){

         // Deleting images From Cloudinary
         for(let i = 0; i <  product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
          }


          const imagesLinks = [];

          for(let i = 0; i< images.length; i++) {
           const result = await cloudinary.v2.uploader.upload(images[i] , {
              folder: "products",
           });
        
           imagesLinks.push({
              public_id:result.public_id,
              url:result.secure_url,
           });
          }
          req.body.images = imagesLinks;
         }
         
   

      
      product = await Product.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true,
         useFindAndModify:false 
      });

      res.status(200).json({
         success:true,
         product
      });
   });


   /// Delete Product-->

   exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{

      const product = await Product.findById(req.params.id);

      if(!product){
         return next(new ErrorHandler("product not found",404));
         
       }

       // Deleting Images from Cloudinary 
       for(let i = 0; i <  product.images.length; i++) {
         await cloudinary.v2.uploader.destroy(product.images[i].public_id);
       }

         await product.remove();

         res.status(200).json({
            success:true,
            message: "isko yeha sey delet kardiya , chill"
         });
      
   });


   // create New Review or Update the Review

   exports.createProductReview = catchAsyncErrors(async(req,res,next) =>{
      const { rating, comment, productId } = req.body;

      const review = {
         user: req.user.id,
         name: req.user.name,
         rating:Number(rating),
         comment,
      };

      const product = await Product.findById(productId);

      const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

      if(isReviewed){
          product.reviews.forEach((rev) => {
            if(rev.user.toString()=== req.user._id.toString())
            (rev.rating = rating),(rev.comment = comment);
            
          })
      }
      else{
         product.reviews.push(review);
         product.numOfReviews = product.reviews.length;
      }
       
      let avg = 0;
      product.ratings = product.reviews.forEach(rev =>{
         avg+=rev.rating
      });
      product.ratings = avg / product.reviews.length;

      await product.save({validateBeforeSave:false});

      res.status(200).json({
         success:true,
      });

   });

  

  /// Get All Reviews Of a product

  exports.getProductsReviews = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.query.id);

    if(!product) { 
      return next(new ErrorHandler("Product not found",404));
    }
    
    res.status(200).json({
      success:true,
      reviews: product.reviews,
    });

  });


  // Delete Reviews 
  
  exports.deleteReview = catchAsyncErrors(async(req,res,next) => {
   const product = await Product.findById(req.query.productId);

   if(!product) { 
      return next(new ErrorHandler("Product not found",404));
   }

   const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
   );

   let avg = 0;

   reviews.forEach((rev)=>{
      avg += rev.rating;
   });

   const ratings = avg / reviews.length;

   const numOfReviews = reviews.length;

   await Product.findByIdAndUpdate(req.query.productId,{
      reviews,
      ratings,
      numOfReviews,
    },
    {
       new:true,
       runValidators:true,
       useFindAndModify:false,
    }
   );

   res.status(200).json({
      success:true,
      reviews: product.reviews,
    });
    

  });
