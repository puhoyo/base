"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyFromProb = exports.getRandomNumberByRange = void 0;
const randy_1 = require("randy");
const moment_1 = __importDefault(require("moment"));
const uuid_1 = __importDefault(require("uuid"));
const logger = require('../../logger');
/**
 * @desc get random integer in range [min, max]
 * @param max (required)
 * @param min ([0, max) if min is undefined.)
 */
function getRandomNumberByRange(max, min) {
    let randomNumber = (0, randy_1.random)();
    if (typeof min !== 'undefined' && min > 0 && max > min) {
        randomNumber *= (max - min + 1);
        randomNumber += min;
    }
    else {
        randomNumber *= max;
    }
    randomNumber = Math.floor(randomNumber);
    return randomNumber;
}
exports.getRandomNumberByRange = getRandomNumberByRange;
;
/**
 * @desc get random number in range [min, max]
 * @param max (required)
 * @param min ([0, max) if min is undefined. same as Math.random(max))
 */
exports.getRandomNumberByRangeFloat = (max, min) => {
    let randomNumber = (0, randy_1.random)();
    if (typeof min !== 'undefined' && min > 0 && max > min) {
        randomNumber *= (max - min + 1);
        randomNumber += min;
    }
    else {
        randomNumber *= max;
    }
    return randomNumber;
};
exports.getRandomArrayByArray = (array, count) => {
    return (0, randy_1.sample)(array, count);
};
exports.getRandomElementByArray = (array) => {
    return (0, randy_1.sample)(array, 1).pop();
};
/**
 * @desc get a random key from prob(prob 객체의 value가 모두 0일 경우, value가 number가 아닐 경우 에러)
 * @param prob: key-value object, value는 소수점 두자리 까지 적용
 * @return {string}
 */
function getKeyFromProb(prob) {
    function getProbability(data) {
        const prob = new Map();
        const multiple = 100;
        let cumulative = 0;
        for (let [key, value] of data) {
            cumulative += Math.round(value * multiple);
            prob.set(key, cumulative);
        }
        prob.set('total', cumulative);
        return prob;
    }
    const probability = getProbability(prob);
    const randomNumber = getRandomNumberByRange(probability.get('total'));
    for (let [key, value] of probability) {
        if (randomNumber < value) {
            return key;
        }
    }
}
exports.getKeyFromProb = getKeyFromProb;
;
exports.getCurrentDatetime = () => {
    const now = (0, moment_1.default)().utc();
    return now.format('YYYY-MM-DD HH:mm:ss');
};
exports.uuidv4 = () => {
    return uuid_1.default.v4();
};
