// just a silly sample of custom middleware 
const log = (req, res, next) => {
    console.log(`Url requested: ${req.url} `);
    next();
};

module.exports = log;