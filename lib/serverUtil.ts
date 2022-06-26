import {random, sample} from 'randy';
import moment from 'moment';
import uuid from 'uuid';
const logger = require('../../logger');
/**
 * @desc get random integer in range [min, max]
 * @param max (required)
 * @param min ([0, max) if min is undefined.)
 */
export function getRandomNumberByRange (max: number, min?: number) {
    let randomNumber = random();
    if(typeof min !== 'undefined' && min > 0 && max > min) {
        randomNumber *= (max - min + 1);
        randomNumber += min;
    }
    else {
        randomNumber *= max;
    }

    randomNumber = Math.floor(randomNumber);
    return randomNumber;
};

/**
 * @desc get random number in range [min, max]
 * @param max (required)
 * @param min ([0, max) if min is undefined. same as Math.random(max))
 */
exports.getRandomNumberByRangeFloat = (max: number, min?: number) => {
    let randomNumber = random();
    if(typeof min !== 'undefined' && min > 0 && max > min) {
        randomNumber *= (max - min + 1);
        randomNumber += min;
    }
    else {
        randomNumber *= max;
    }

    return randomNumber;
};

exports.getRandomArrayByArray = (array: [], count: number) => {
    return sample(array, count);
};

exports.getRandomElementByArray = (array: []) => {
    return sample(array, 1).pop();
};

/**
 * @desc get a random key from prob(prob 객체의 value가 모두 0일 경우, value가 number가 아닐 경우 에러)
 * @param prob: key-value object, value는 소수점 두자리 까지 적용
 * @return {string}
 */
export function getKeyFromProb(prob: Map<string, number>) {
    function getProbability(data: Map<string, number>) {
        const prob = new Map();
        const multiple = 100;

        let cumulative = 0;
        for(let [key, value] of data) {
            cumulative += Math.round(value * multiple);
            prob.set(key, cumulative);
        }

        prob.set('total', cumulative);

        return prob;
    }

    const probability = getProbability(prob);

    const randomNumber = getRandomNumberByRange(probability.get('total'));
    for(let [key, value] of probability) {
        if(randomNumber < value) {
            return key;
        }
    }
};

exports.getCurrentDatetime = () => {
    const now = moment().utc();
    return now.format('YYYY-MM-DD HH:mm:ss');
}

exports.uuidv4 = () => {
    return uuid.v4();
}