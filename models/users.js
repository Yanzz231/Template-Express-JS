const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// PRISMA
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

// HELPER
const {responseJson} = require("../helper/response");
const {func} = require("../helper/function");

const Users = {
    register: async (res, data) => {
        try {
            const {username, password, email, phone} = data;

            const existingUser = await func.findUnique({username: username})
            if (existingUser) return responseJson(res, false, [], "Username is already in use.");
            const existingEmail = await func.findUnique({email: email})
            if (existingEmail) return responseJson(res, false, [], "Email is already in use.");

            const hashedPassword = await bcrypt.hash(password, 10);
            const otp_verify = func.generateRandom4Digit();
            const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000);

            const user = await prisma.user.create({
                data: {
                    status: "unactive",
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phone,
                    token: null,
                    otp_verify: String(otp_verify),
                    otp_reminder: fiveMinutesLater,
                    otp_password: null,
                    otp_password_reminder: null,
                }
            })

            if (user) {
                await func.sendMail(otp_verify, email)
                return responseJson(res, true, user, "Berhasil Register")
            }
        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },
    login: async (res, data) => {
        try {
            const {username, password} = data;

            var findManyData = await func.findMany({username: username})
            if (findManyData.length === 0) {
                findManyData = await func.findMany({email: username})
            }
            if (findManyData.length === 0) return responseJson(res, "not_found", [], "Not Found")

            const checkPassword = await bcrypt.compare(password, findManyData[0].password)
            if (!checkPassword) return responseJson(res, "wrong_password", [], "Wrong Password")

            if (findManyData[0].status === "unactive" && findManyData[0].otp_verify === null) {
                const otp_verify = func.generateRandom4Digit();
                const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000);
                await prisma.user.update({
                    where: {email: findManyData[0].email},
                    data: {otp_reminder: fiveMinutesLater, otp_verify: String(otp_verify)}
                });
                await func.sendMail(otp_verify, findManyData[0].email)

                return responseJson(res, "unactive", [], "Not Verify")
            }

            if (findManyData[0].status === "unactive") return responseJson(res, "unactive", [], "Not Unactive")

            const token = jwt.sign({}, process.env.JWT_SECRET)
            const user = await prisma.user.update({where: {email: findManyData[0].email}, data: {token: token}})
            return responseJson(res, true, user, "Berhasil Login")
        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },
    verify: async (res, data) => {
        try {
            const {email, otp, new_password, type} = data
            console.log(type)
            const findData = await func.findMany({email: email})
            if (findData.length === 0) return responseJson(res, "not_found", [], "Not Found")

            if (type === "verify" && findData[0].status === "unactive") {
                if (!email || !otp || findData[0].otp_verify === null) return responseJson(res, false, [], "Error Params")
                if (findData[0].otp_verify !== otp && findData[0].otp_verify !== null) return responseJson(res, "wrong_otp", [], "OTP Wrong")

                const user = await prisma.user.update({
                    where: {email: email},
                    data: {status: "active", otp_verify: null, otp_reminder: null}
                })

                return responseJson(res, true, user, "Berhasil Verify")
            }

            if (type === "forget-password" && findData[0].status === "active") {
                if (!new_password || !email || !otp || findData[0].otp_password === null) return responseJson(res, false, [], "Error Params")
                if (findData[0].otp_password !== otp && findData[0].otp_password !== null) return responseJson(res, "wrong_otp", [], "OTP Wrong")

                const oldPassword = await bcrypt.compare(new_password, findData[0].password)
                if (oldPassword) return responseJson(res, "same_password", [], "Same Password")

                const hashedPassword = await bcrypt.hash(new_password, 10);
                const user = await prisma.user.update({
                    where: {email: email},
                    data: {otp_password: null, otp_password_reminder: null, password: hashedPassword}
                })

                return responseJson(res, true, user, "Berhasil Verify")
            }

            return responseJson(res, false, [], "Error Params")
        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },
    forget_password: async (res, data) => {
        try {
            const {email} = data

            const findData = await func.findMany({email: email})
            if (findData.length === 0) return responseJson(res, "not_found", [], "Not Found")
            if(findData[0].otp_password !== null)  return responseJson(res, false, [], "Error Params")

            const otp_password = func.generateRandom4Digit();
            const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000);

            const user = await prisma.user.update({
                where: {email: findData[0].email},
                data: {otp_password: String(otp_password), otp_password_reminder: fiveMinutesLater}
            })

            await func.sendMail(otp_password, findData[0].email, "forget_password")

            return responseJson(res, true, user, "Send Otp")
        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    },
    change_password: async (res, data) => {
        try {
            const {email, password, new_password} = data
            const findData = await func.findMany({email: email})
            if (findData.length === 0) return responseJson(res, "not_found", [], "Not Found")

            const checkPassword = await bcrypt.compare(password, findData[0].password)
            if (!checkPassword) return responseJson(res, "wrong_password", [], "Wrong Password")

            const hashedPassword = await bcrypt.hash(new_password, 10);
            const user = await prisma.user.update({where: {email: findData[0].email}, data: {password: hashedPassword}})

            return responseJson(res, true, user, "Berhasil Ubah Password")
        } catch (err) {
            return responseJson(res, false, [], err.message)
        }
    }
}

module.exports = Users