import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPositiveInteger } from '../utils/validators.js';

const validateId = (req, res, next) => {
    if (!isPositiveInteger(req.params.id)) throw new BadRequestError(Messages.INVALID_ID);

    next();
};

export default validateId;
