class ErrorHander extends Error{
    constructor(message,statesCode){
        super(message);
        this.statesCode = statesCode;
        Error.captureStackTrace(this,this.constructor);

    }
}
module.exports = ErrorHander;