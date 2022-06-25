const Sequelize = require('sequelize');
const config = require('../config/config')['database']['mysql'];

const fs = require('fs');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);
db.sequelize = sequelize;

exports.dbSync = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname, (err, files) => {
            const modelNames = [];
            for (let i in files) {
                const split = files[i].split('.');
                const modelName = split[0];
                const extension = split[1];
                if (extension === 'js' && !(modelName === 'index' || modelName === 'redis')) {
                    modelNames.push(modelName.charAt(0).toUpperCase() + modelName.slice(1));
                }
            }

            for (let i = 0; i < 3; i++) {
                switch (i) {
                    case 0:
                        modelNames.forEach(modelName => {
                            const model = require(__dirname + `/${modelName}`);
                            db[modelName] = model;
                        });
                        break;
                    case 1:
                        for (let key in db) {
                            if (modelNames.indexOf(key) !== -1) {
                                db[key].init(sequelize);
                            }
                        }
                        break;
                    case 2:
                        for (let key in db) {
                            if (modelNames.indexOf(key) !== -1) {
                                db[key].associate(db);
                            }
                        }
                        break;
                }
            }

            resolve(db);
        });
    });
}