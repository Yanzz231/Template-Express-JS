var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var chalk = require('chalk');

require('dotenv').config();

var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// ROUTER
app.use('/api/users', usersRouter);

// LISTINGIN TO PORT
const port = process.env.port || 3000
app.listen(port, () => {
    console.log(chalk.green(`Listen to Port ${port}`));
})


module.exports = app;
