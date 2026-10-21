export const isPlainObject = (value) =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

export const isOptionalString = (value) =>
    value === undefined || typeof value === 'string';

export const isOptionalBoolean = (value) =>
    value === undefined || typeof value === 'boolean';

export const isPositiveNumber = (value) =>
    typeof value === 'number' && Number.isFinite(value) && value > 0;

export const isPositiveInteger = (value) =>
    /^\d+$/.test(String(value)) && Number(value) > 0;

export const isIntegerBetween = (value, min, max) =>
    Number.isInteger(value) && value >= min && value <= max;

/* Un teléfono sirve si tiene al menos 8 dígitos, con o sin espacios y guiones */
export const isTelefono = (value) =>
    typeof value === 'string' && value.replace(/\D/g, '').length >= 8;
