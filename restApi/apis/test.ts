import { ApiBase, ResData } from './apiBase';
import {Request} from 'express';
interface ApiResponseFormat {
    t3: number;
    t4: string;
}
/**
 * @desc test
 */
module.exports =  class Test extends ApiBase {
    constructor() {
        const apiName = 'test';
        const requestPacketFormat = {
            t1: typeof 0,
            t2: typeof '',
        };
        
        super(apiName, requestPacketFormat);
    }

    async execute(req: Request, user: User, data: any): Promise<ResData<ApiResponseFormat>> {
        const response = {
            success: false,
            data: {
                t3: 0,
                t4: '',
            },
        };
        try {
            response.success = true;
            response.data.t3 = 1;
            response.data.t4 = 'a';
        }
        catch(error) {
            console.error(error);
        }
        return response;
    }
};