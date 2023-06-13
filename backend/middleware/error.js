const ErrorHandler = require('../utils/errorhander');

module.exports = function (err,req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server Error";


    //wrong mongodb id error
    if (err.name === "CastError"){
        const message = `Resource not Found. invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}