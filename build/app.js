"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');
dotenv.config();
const { dbSync } = require('../models');
// const mongoDB = require('./schemas');
const { controllerInit } = require('../controllers');
const { routerInit } = require('../routes/routers');
const logger = require('../logger');
const axios = require('axios').default;
const app = (0, express_1.default)();
app.set('port', process.env.PORT || 8080);
app.set('socketHandler', new Map());
app.set('axios', axios);
app.set('view engine', 'html');
app.set('logger', logger);
nunjucks.configure('views', {
    express: app,
    watch: true,
});
const config = require('../config/config');
if (process.env.NODE_ENV === 'production')
    config.database.mysql.logging = false; //do not mysql logging on production
for (let key in config) {
    //set config data to app if config data is not object type
    if (config.hasOwnProperty(key) && typeof config[key] !== 'object')
        app.set(key, config[key]);
}
dbSync()
    .then((db) => {
    app.set('db', db);
    return db.sequelize.sync({ force: false });
})
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('database connection');
    if (app.get('useRedis')) {
        const redisClient = require('../models/redis')(config.database.redis.url, config.database.redis.database);
        app.set('redisClient', redisClient);
        yield redisClient.connect();
        console.log('redisClient connection');
    }
    const restApiHandler = require('../restApi/restApiHandler');
    app.set('restApiHandler', new restApiHandler());
    if (app.get('useSocket')) {
        const socketApiHandler = require('../socket/socketApiHandler');
        app.set('socketApiHandler', new socketApiHandler());
    }
    return controllerInit();
}))
    .then((controllers) => {
    for (let controllerName in controllers) {
        if (controllers.hasOwnProperty(controllerName)) {
            app.set(controllerName, controllers[controllerName]);
        }
    }
    return routerInit();
})
    .then((routers) => {
    app.use('/', (req, res, next) => {
        // res.header('Access-Control-Allow-Origin', '*');
        next();
    });
    for (let url in routers) {
        if (routers.hasOwnProperty(url)) {
            app.use(url, routers[url]);
        }
    }
    app.use((req, res, next) => {
        const error = new Error(`${req.method} ${req.url} router is not defined.`);
        error.status = 404;
        logger.error(new Date());
        logger.error(error.message);
        next(error);
    });
    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
        res.status(err.status || 500);
        res.send('error');
    });
    app.set('ready', true);
    console.log('server ready');
})
    .catch((err) => {
    console.error(err);
});
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
}
else {
    app.use(morgan('dev'));
}
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const dataConfig = config.data[process.env.NODE_ENV];
const data = new Map();
for (let key in dataConfig) {
    if (dataConfig.hasOwnProperty(key)) {
        data.set(key, dataConfig[key]);
    }
}
app.set('data', data);
module.exports = app;
