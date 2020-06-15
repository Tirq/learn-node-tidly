const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index', { title:'My express app using pug', 
                          msg:'My express app using pug as the template generator...'});
});

module.exports = router;