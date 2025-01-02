/**
 * redis.js
 * Shrikant Aher
 */

const {
	errors: { NotFoundError },
} = require('../config');

const getLogger = require('../utilities/logger');
const logger = getLogger(__filename);

const redisSet = async (key, data, ttl) => {
	const redisClient = global.redisClient;
	if (ttl) {
		await redisClient.set(
			key,
			JSON.stringify(data),
			'EX',
			ttl,
			// NX: true,
		);
	} else {
		await redisClient.set(key, JSON.stringify(data));
	}
};

const redisZadd = async (key, score, data, ttl) => {
	try {
		const redisClient = global.redisClient;
		await redisClient.zadd(key, score, JSON.stringify(data));
		if (ttl) {
			await redisClient.expire(key, ttl);
		}
	} catch (e) {
		logger.error('Redis Client Error', e);
	}
};

const redisGet = async (key) => {
	const redisClient = global.redisClient;
	const data = await redisClient.get(key);
	if (data === null) throw new NotFoundError('Redis Data Not found');
	return JSON.parse(data);
};

const redisZrange = async (key, page, limit, options) => {
	const redisClient = global.redisClient;
	let data;
	if (options?.by) {
		data = await redisClient.zrange(key, page, limit, 'REV', options.by, 'LIMIT', options.LIMIT.offset, options.LIMIT.count);
	} else {
		data = await redisClient.zrange(key, page, limit, 'REV');
	}
	if (!data.length > 0) throw new NotFoundError('Redis Data Not found');
	return data.map((i) => JSON.parse(i));
};

const redishGetAll = async (key) => {
	try {
		const redisClient = global.redisClient;
		const data = await redisClient.hgetall(key);
		return data;
	} catch (e) {
		logger.info('Redis Client Error');
	}
};

const redisZrem = async (key, data) => {
	const redisClient = global.redisClient;
	await redisClient.zrem(key, [JSON.stringify(data)]);
};

const redisZremByScore = async (key, score) => {
	const redisClient = global.redisClient;
	await redisClient.zrevrangebyscore(key, '-inf', score);
};

const redisClear = async (key) => {
	const redisClient = global.redisClient;
	redisClient.del(key);
};

const redisHset = async (key, field, data, timeStamp) => {
	const redisClient = global.redisClient;
	await redisClient.hset(key, field, JSON.stringify(data));
	if (timeStamp) {
		await redisClient.expire(key, timeStamp);
	}
};

const redisIncr = async (key) => {
	const redisClient = global.redisClient;
	await redisClient.incr(key);
};

module.exports = {
	redisSet,
	redisClear,
	redisGet,
	redisZadd,
	redisZrem,
	redisZremByScore,
	redisHset,
	redisIncr,
	redishGetAll,
	redisZrange,
};