'use strict';

const getLogger = require('../../src/utilities/logger');
const logger = getLogger(__filename);

const { dbInit } = require('../../src/app');

const {
	User: { login },
} = require('../../src/controllers');

// eslint-disable-next-line no-undef
describe('Unit Test Cases', async function () {
	// eslint-disable-next-line no-undef
	before(async () => {
		await dbInit();  
	});

	// eslint-disable-next-line no-undef
	it('Functional Login', async function () {
		const expect = (await import('chai')).expect;
		const resp = await login({
			countryCode: '+91',
			phoneNumber: '7410594723',
		});

		expect(resp).to.include.keys(['accessToken','_id']);
		logger.info('done');
	});


});
