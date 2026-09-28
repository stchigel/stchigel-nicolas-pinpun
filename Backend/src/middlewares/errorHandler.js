import AppError from '../exceptions/AppError.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { Messages } from '../enums/Messages.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return ApiResponse.error(res, err.message, err.statusCode);
    }

    if (err.type === 'entity.parse.failed') {
        return ApiResponse.error(res, Messages.INVALID_JSON, HttpStatus.BAD_REQUEST);
    }

    console.error(err);
    return ApiResponse.error(res, Messages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
};

export default errorHandler;
