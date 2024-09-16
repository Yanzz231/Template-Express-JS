var express = require('express');

// ROUTER
var router = express.Router();
const Users = require('../models/users');

// HELPER
const {responseJson} = require("../helper/response");
const err = require("jsonwebtoken/lib/JsonWebTokenError");

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

router.post('/logout', async function (req, res, next) {
    try {
        // CHECKING TOKEN
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return responseJson(res, false, [], "Token tidak ada")
        }

        await Users.logout(res, req.body)
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});

router.put('/changepassword', async function (req, res, next) {
    try {
        // DATA BODY
        const {email, new_password, old_password} = req.body

        // CHECKING TOKEN
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return responseJson(res, false, [], "Token tidak ada")
        }

        const token = authHeader.split(' ')[1]

        await Users.change_password(res, {
            token: token,
            email: email,
            old_password: old_password,
            new_password: new_password
        })
    } catch (err) {
        return responseJson(res, false, [], err.message)
    }
});


module.exports = router;
