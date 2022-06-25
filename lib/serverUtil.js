const randy = require('randy');
const moment = require('moment');
const uuid = require('uuid');
const logger = require('../logger');
/**
 * @desc get random integer in range [min, max]
 * @param max (required)
 * @param min ([0, max) if min is undefined.)
 */
exports.getRandomNumberByRange = (max, min) => {
    let randomNumber = randy.random();
    if(min > 0 && max > min) {
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
exports.getRandomNumberByRangeFloat = (max, min) => {
    let randomNumber = randy.random();
    if(min > 0 && max > min) {
        randomNumber *= (max - min + 1);
        randomNumber += min;
    }
    else {
        randomNumber *= max;
    }

    return randomNumber;
};

exports.getRandomArrayByArray = (array, count) => {
    return randy.sample(array, count);
};

exports.getRandomElementByArray = (array) => {
    return randy.sample(array, 1).pop();
};

/**
 * @desc get a random key from prob(prob 객체의 value가 모두 0일 경우, value가 number가 아닐 경우 에러)
 * @param prob: key-value object, value는 소수점 두자리 까지 적용
 * @return {string}
 */
exports.getKeyFromProb = (prob) => {
    function getProbability(data) {
        const prob = {};
        const multiple = 100;

        let cumulative = 0;
        for(let key in data) {
            cumulative += Math.round(data[key] * multiple);
            prob[key] = cumulative;
        }

        prob.probLength = cumulative;

        return prob;
    }

    for(let key in prob) {
        if(!prob.hasOwnProperty(key) || typeof prob[key] !== 'number') {
            logger.error('getKeyFromProb type error');
            return null;
        }
    }
    const probability = getProbability(prob);

    const randomNumber = this.getRandomNumberByRange(probability.probLength);
    for(let key in probability) {
        if(randomNumber < probability[key]) {
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

/**
 * @desc shuffle an array
 * @param array
 */
exports.shuffle = array => {
    for (let index = array.length - 1; index > 0; index--) {
        const randomPos = this.getRandomNumberByRange(index + 1);

        const tem = array[index];
        array[index] = array[randomPos];
        array[randomPos] = tem;
    }
}

exports.isValidPacket = (format, packet) => {
    let isValidPacket = true;
    for(let key in format) {
        if(!packet.hasOwnProperty(key)) {
            isValidPacket = false;
            break;
        }
    }

    return isValidPacket;
}