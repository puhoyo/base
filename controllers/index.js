const fs = require('fs');

exports.controllerInit = () => {
    return new Promise(resolve => {
        fs.readdir(__dirname, async (err, files) => {
            const controllerNames = [];
            for (let i in files) {
                const split = files[i].split('.');
                const controllerName = split[0];
                const extension = split[1];
                if (extension === 'js' && !(controllerName === 'index' || controllerName === 'controllerBase')) {
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