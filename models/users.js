const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// DATABASE
const db = require("../config/connection")

// HELPER
const {responseJson} = require("../helper/response");

const Users = {
    login: async (res, data) => {
        // DATA BODY
        const {username, email, password} = data

        // TEMPORARY DATA
        var side_data = []
        var account = ""

        try {
            // CHECKING EMAIL AND USERNAME
            const [email_check] = await db.promise().execute("SELECT * FROM users WHERE email = ?", [email])
            if (email_check.length === 0) {
                const [username_check] = await db.promise().execute("SELECT * FROM users WHERE username = ?", [username])
                if (username_check.length === 0) {
                    return responseJson(res, "data_not_found", [], "Data Tidak Ada")
                } else {
                    side_data = username_check
                    account = username
                }
            } else {
                side_data = email_check
                account = email
            }

            // CHECKING PASSWORD WITH BCRYPT COMPARE
            const checkPassword = await bcrypt.compare(password, side_data[0].password)
            if (!checkPassword) {
                return responseJson(res, "password_incorrect", [], "Password Salah")
            }

            // CONVERST TOKEN WITH JWT
            const token = jwt.sign({}, process.env.JWT_SECRET)

            // SQL UPDATE TOKEN TO JWT CODE
            const sqlMessage = 'UPDATE users SET token = ? WHERE email = ?';
            await db.promise().execute(sqlMessage, [token, account])

            return responseJson(res, true, {account: account, password: password, token: token}, "Berhasil Login")

        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },


    create: async (res, data) => {
        // DATA BODY
        const {username, email, password} = data

        try {
            // CHECKING EMAIL
            const [email_check] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [email])
            if (email_check.length > 0) {
                return responseJson(res, false, [], "Email Sudah Terdaftar")
            }

            // CONVERT PASSWORD TO BCRYPT CODE
            const hashPassword = await bcrypt.hash(password, 10)
            // DEFAULT TOKEN IS NULL
            const token = null

            // INSERT DATA BY DATA BODY
            const sqlMessage = 'INSERT INTO users (username, email, password, token) VALUES(?, ?, ?, ?)'
            await db.promise().execute(sqlMessage, [username, email, hashPassword, token])

            return responseJson(res, true, data, "Berhasil Menambahkan Data Users")

        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },

    logout: async (res, data) => {
        // DATA BODY
        const {username, email, password} = data

        // TEMPORARY DATA
        var account = ""

        try {
            // CHECKING EMAIL AND USERNAME
            const [email_check] = await db.promise().execute("SELECT * FROM users WHERE email = ?", [email])
            if (email_check.length === 0) {
                const [username_check] = await db.promise().execute("SELECT * FROM users WHERE username = ?", [username])
                if (username_check.length === 0) {
                    return responseJson(res, "data_not_found", [], "Data Tidak Ada")
                } else {
                    account = username
                }
            } else {
                account = email
            }

            // SQL UPDATE TOKEN TO NULL
            const sqlMessage = 'UPDATE users SET token = ? WHERE email = ?';
            await db.promise().execute(sqlMessage, [null, account])

            return responseJson(res, true, {account: account, password: password}, "Berhasil Logout")

        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    }
}

module.exports = Users