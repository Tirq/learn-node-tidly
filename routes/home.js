const debug = require('debug')('app::home');
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    debug('Home debugged!');
    res.render('index', { title:'My express app using pug', 
                          msg:'My express app using pug as the template generator...'});
});

module.exports = router;