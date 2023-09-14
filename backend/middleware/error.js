const ErrorHandler = require('../utils/errorhander');

module.exports = function (err,req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server Error";


    //wrong mongodb id error
    if (err.name === "CastError"){
        const message = `Resource not Found. invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    // monguse duplicate key errors

        if( err.code === 11000){
            const message = `duplicate ${Object.keys(err.keyvalue)} entered `
        }
        // wrong jwt error
        if(err.name === "JswonWebTokenError"){
            const message = ` Json web Token is invalid ,try again`;
            err = new ErrorHandler(message,400);

        }

        //JWT Expire error

        if(err.name === "JswonWebTokenExpireError"){
                const messgae = `json web token is expired ,, try again `;
                err = new ErrorHandler(messgae,400);
        } 
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}