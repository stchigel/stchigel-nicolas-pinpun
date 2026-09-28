import AppError from '../exceptions/AppError.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { Messages } from '../enums/Messages.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_JSON });
    }

    console.error(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
};

export default errorHandler;
