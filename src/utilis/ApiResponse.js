class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        // Initialize properties based on constructor parameters
        this.statusCode = statusCode; // HTTP status code of the response
        this.data = data; // Data included in the response
        this.message = message; // Optional message describing the response
        this.success = statusCode >= 200 && statusCode < 400; // Determine if the response is successful
    }
}

export { ApiResponse };
