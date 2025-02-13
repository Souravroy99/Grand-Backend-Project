class ApiResponse {
    statusCode; data; message; success; // Do it or don't, it doesn't matter.

    constructor(statusCode, data, message="Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
} 

export {ApiResponse};