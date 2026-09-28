import { HttpStatus } from '../enums/HttpStatus.js';

class AppError extends Error {
    constructor(message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends AppError {
    constructor(message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, HttpStatus.CONFLICT);
    }
}

export default AppError;
