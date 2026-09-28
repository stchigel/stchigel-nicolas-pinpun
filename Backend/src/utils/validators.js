export const isPlainObject = (value) =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

export const isOptionalString = (value) =>
    value === undefined || typeof value === 'string';

export const isPositiveNumber = (value) =>
    typeof value === 'number' && Number.isFinite(value) && value > 0;

export const isPositiveInteger = (value) =>
    /^\d+$/.test(String(value)) && Number(value) > 0;
