const Product = require("../models/productModel");





//create product
exports.createProduct = async (req, res, next) => {

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}

// get all products
exports.getAllproducts=  async (req, res, next) => {

    const productss = await Product.find();

    res.status(200).json({
        success: true,
        productss
    }); 
}


//update product -- admin

exports.updateProduct = async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };


  exports.getProductDetainls = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success:false,
        message:"product not found"
      })
    }
    res.status(200).json({
      success:true,
      product
    })

  }

  exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
}


  