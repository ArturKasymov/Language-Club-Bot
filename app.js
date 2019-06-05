
const CONSTANTS = require('./model/Constants.js');
const request = CONSTANTS.request;

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import path from 'path';

import index from './routes/index';
import users from './routes/users';
import registration from './routes/registration';
import nickname from './routes/nickname';
import languages from './routes/languages';
import organizators from './routes/organizators';
import createmeeting from './routes/createmeeting';
import webhooks from './routes/webhooks';

const app = express();

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(logger('dev'));

app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/nickname', nickname);
app.use('/languages', languages);
app.use('/organizators', organizators);
app.use('/createmeeting', createmeeting)
app.use('/webhook', webhooks);

app.use(function(req, res, next) {
    console.log("REQ: " + req);
    console.log("RES " + res);
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')));

module.exports = app;