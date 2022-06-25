const fs = require('fs');

exports.controllerInit = () => {
    return new Promise(resolve => {
        fs.readdir(__dirname, (err, files) => {
            const controllerNames = [];
            for (let i in files) {
                const controllerName = files[i].split('.')[0];
                if (!(controllerName === 'index' || controllerName === 'controllerBase')) {
                    controllerNames.push(controllerName);
                }
            }

            const controllers = {};
            controllerNames.forEach(controllerName => {
                const controller = require(__dirname + `/${controllerName}`);
                controllers[controllerName] = new controller;
            });

            resolve(controllers);
        });
    });
}