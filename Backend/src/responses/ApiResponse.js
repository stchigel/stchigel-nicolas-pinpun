import { HttpStatus } from '../enums/HttpStatus.js';

class ApiResponse {
    static success(res, data, statusCode = HttpStatus.OK) {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    static error(res, message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}

export default ApiResponse;
