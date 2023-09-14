const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");





//create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
      success: true,
      product
    }
    );
  });


// get all products
exports.getAllproducts=  catchAsyncErrors(async (req, res, next) => {
   
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const productss = await apiFeature.query;

    res.status(200).json({
        success: true,
        productss
    }); 
});


//update product -- admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!product) {
        return next(new ErrorHander("product not found",404));
      }
  
      res.status(200).json({
        success: true,
        data: product,
        productCount,

      });
    } catch (error) {
      next(error);
    }
  });


  exports.getProductDetainls = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("product not found",404));
    }
    res.status(200).json({
      success:true,
      product
    })

  });

  exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
      return next(new ErrorHander("product not found",404));
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    });
});

// create new review or update review 

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id, 
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all reviews of the product

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete review

exports.deleteReview = catchAsyncErrors(async (req, res,next)=>{
  const product =  await Product.findById(req.query.productId);
  if(!product) {
    return next(new ErrorHander("Product not found", 404));

  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()


  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let rating = 0 ;

  if(reviews.length === 0){
    rating = 0 ;

  }else{
    rating = avg / reviews.length;

  }
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,

    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
   
  );
  res.status(200).json({
    success:true,
  });
});




  