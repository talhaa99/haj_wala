const ThrowError = require("./ThrowError")

const sendErrorResponse = (response, error) => {
    let statusCode = 500;    
    if(error instanceof ThrowError) statusCode = error.statusCode;
    response.status(statusCode).json({success: false, message: error.message, data: error.data || {}});
}

module.exports = {sendErrorResponse};