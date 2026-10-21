import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject, isNonEmptyString } from '../utils/validators.js';

const validateLogin = (req, res, next) => {
    if (!isPlainObject(req.body) || !isNonEmptyString(req.body.mail) || !isNonEmptyString(req.body.contrasena)) {
        throw new BadRequestError(Messages.INVALID_LOGIN);
    }

    next();
};

export default validateLogin;
