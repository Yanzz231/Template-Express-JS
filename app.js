var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var chalk = require('chalk');
const cron = require('node-cron');

const {func} = require("./helper/function");

cron.schedule('* * * * *', async () => {
    await func.checkAndExpireOtp('otp_verify', 'otp_reminder', 'OTP Verify');
    await func.checkAndExpireOtp('otp_password', 'otp_password_reminder', 'OTP Password');
});



require('dotenv').config();

var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/users', usersRouter);

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(chalk.green(`Listen to Port ${port}`));
})

module.exports = app;
