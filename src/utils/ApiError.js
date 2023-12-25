export class ApiError extends Error {
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        this.data = null;
        
        stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor);
    }
}