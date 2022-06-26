export interface ResData<T> {
    success: boolean;
    data: T | null;
}
export class ApiBase {
    apiName: string;
    requrestPacketFormat: any;
    constructor(apiName: string, requestPacketFormat: object) {
        this.apiName = apiName;
        this.requrestPacketFormat = requestPacketFormat;
    }

    getApiName() {
        return this.apiName;
    }

    isValidPacket(data: any) {
        let isValidPacket: boolean = true;
        for(let key in this.requrestPacketFormat) {
            const type = this.requrestPacketFormat[key];
            console.log('typeof data[key]:' , typeof data[key]);
            console.log('type:' , type);
            if(!data || typeof data[key] !== type) {
                isValidPacket = false;
                break;
            }
        }

        return isValidPacket;
    }
}