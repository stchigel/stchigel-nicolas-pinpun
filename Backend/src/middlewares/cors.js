const ALLOWED_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const cors = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.sendStatus(204);

    next();
};

export default cors;
