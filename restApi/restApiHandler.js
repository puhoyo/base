const util = require('util');
const fs = require('fs');
const readdir = util.promisify(fs.readdir);
const logger = require('../logger');
const path = require('path');

module.exports = class RestApiHandler {
    constructor() {
        this.apis = new Map();

        this.init();
    }

    async init() {
        try {
            const apisDir = path.join(process.cwd(), '/dist/restApi/apis');
            const files = await readdir(apisDir);
            for(let i in files) {
                const split = files[i].split('.');
                const modelName = split[0];
                const extension = split[1];
                if (extension === 'js' && !(modelName === 'apiBase')) {
                    const apiModel = require(path.join(process.cwd(), `/dist/restApi/apis/${files[i]}`));
                    const api = new apiModel();
                    const apiName = api.getApiName();
                    this.apis.set(apiName, api);
                }
            }
        }
        catch(error) {
            console.log(error);
            logger.error(`apiHandler init error: ${error}`);
        }
    }

    getApi(apiName) {
        return this.apis.get(apiName);
    }
}
