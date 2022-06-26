import { Request, Response, NextFunction } from "express";
const logger = require('../../logger');

export const restApi = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req.body: ', req.body);
    const apiName = req.body.api;
    let data = req.body.data;
    const userId = res.locals.userId;
    
    function getError(message: string) {
        return {
            success: false,
            message,
        }
    }
    try {
        const apiHandler = req.app.get('restApiHandler');
        const api = apiHandler.getApi(apiName);
        if(typeof api === 'undefined') {
            console.log('api: ', apiName);
            return res.json(getError('invalid api'));
        }
        else {
            console.log('data: ', data);
            if(typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(typeof data !== 'object') {
                return res.send(getError('invalid request data type'));
            }

            if(!api.isValidPacket(data)) return res.send(getError('invalid request packet format'));

            for(let i in data) { //parse numbers
                data[i] = isNaN(data[i]) ? data[i] : parseInt(data[i]);
            }

            const user: User = {
                userId,
            };
            const resData = await api.execute(req, user, data);

            if(resData) {
                res.locals.resData = resData;
                return res.send(resData);
            }
            else {
                return res.send(getError('api request failed'));
            }
        }
    }
    catch(error: any) {
        console.log(error);
        logger.error(error);
        return res.send(getError(error.message));
    }
};