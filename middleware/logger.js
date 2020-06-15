const debug = require('debug')('app::logger');
// just a silly sample of custom middleware 
const log = (req, res, next) => {
    debug(`Url requested by custom middleware: ${req.url} `);
    next();
};

module.exports = log;