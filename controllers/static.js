var express = require('express');
var router = express.Router();
 
router.use(express.static(__dirname+'/../www')); // get other pages
router.use(express.static(__dirname+'/../www/img')); // get images
router.use(express.static(__dirname+'/../www/favicon')); // get favicon
router.use(express.static(__dirname+'/../www/js')); // get js related to app.js and others
router.use(express.static(__dirname+'/../www/css')); // get css files

module.exports = router;
