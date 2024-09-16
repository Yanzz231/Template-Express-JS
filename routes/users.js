var express = require('express');

// ROUTER
var router = express.Router();
const Users = require('../models/users');
// HELPER
const {responseJson} = require("../helper/response");

/* GET users listing. */
router.post('/login', async function (req, res, next) {
    try {
        await Users.login(res, req.body)
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.post('/create', async function (req, res, next) {
    try {
        await Users.create(res, req.body)
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});


module.exports = router;
