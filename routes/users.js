var express = require('express');

// ROUTER
var router = express.Router();
const Users = require('../models/users');

// HELPER
const {responseJson} = require("../helper/response");

router.post('/register', async function (req, res, next) {
    try {
        Users.register(res, req.body);
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.post('/login', async function (req, res, next) {
    try {
        Users.login(res, req.body);
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.post('/verify', async function (req, res, next) {
    try {
        Users.verify(res, req.body);
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.post('/forget-password', async function (req, res, next) {
    try {
        Users.forget_password(res, req.body);
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.post('/change-password', async function (req, res, next) {
    try {
        Users.change_password(res, req.body);
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

module.exports = router;
