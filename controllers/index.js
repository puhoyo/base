const fs = require('fs');

exports.controllerInit = () => {
    return new Promise(resolve => {
        fs.readdir(__dirname, async (err, files) => {
            const controllerNames = [];
            for (let i in files) {
                const controllerName = files[i].split('.')[0];
                if (!(controllerName === 'index' || controllerName === 'controllerBase')) {
                    controllerNames.push(controllerName);
                }
            }

            const controllers = {};

            for(let i = 0; i < controllerNames.length; i++) {
                const controllerName = controllerNames[i];
                const controller = require(__dirname + `/${controllerName}`);
                controllers[controllerName] = new controller;
                if(typeof controllers[controllerName].init === 'function') {
                    await controllers[controllerName].init();
                }
            }
            resolve(controllers);
        });
    });
}