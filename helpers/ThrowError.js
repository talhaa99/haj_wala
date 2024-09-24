class ThrowError extends Error{
    constructor(msg= 'Server Error', statusCode= 500, data= {}) {
        super(msg); // this.msg = msg
        this.statusCode = statusCode;
        this.data = data;
    }
};

module.exports = ThrowError;