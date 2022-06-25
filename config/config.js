require('dotenv').config();

module.exports = {
    database: {
        mysql: {
            username: process.env.SEQUELIZE_USERNAME,
            password: process.env.SEQUELIZE_PASSWORD,
            database: process.env.SEQUELIZE_DBNAME,
            host: process.env.SEQUELIZE_HOST,
            dialect: 'mysql',
        },
        redis: {
            url: `redis://${process.env.REDIS_URL}`,
            database: process.env.REDIS_DB,
        },
    },
    useRedis: false,
    useSocket: false,
    data: {
        local: {

        },
        development: {

        },
        production: {

        },
    }
}