// just a silly sample of custom middleware 
const log = (req, res, next) => {
    console.log(`Url requested by custom middleware: ${req.url} `);
    next();
};

module.exports = log;