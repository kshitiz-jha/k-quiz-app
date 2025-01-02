/**
 * wrapperService.js
 * shrikant aher
 */



const Model = require('../models');

module.exports = (model) => {
	const Services = {};

	Services.create = async (objToSave) => {
		return JSON.parse(JSON.stringify(await new Model[model](objToSave).save()));
	};

	Services.createMany = async (arrToSave) => {
		return JSON.parse(JSON.stringify(await Model[model].insertMany(arrToSave)));
	};

	Services.getOne = async (criteria, projection, options = {}) => {
		options.lean = true;
		options.virtuals = true;
		return Model[model].findOne(criteria, projection, options);
	};

	Services.getMany = async (criteria, projection, options = {}) => {
		options.lean = true;
		options.virtuals = true;

		if (options.sortKey) {
			if (!options.sortOrder) options.sortOrder = -1;
			try { options.page = parseInt(options.page); } catch (e) { options.page = 1; }
			try { options.limit = parseInt(options.limit); } catch (e) { options.limit = 10; }

			return Model[model].find(criteria, projection, options)
				.sort({ [options.sortKey]: options.sortOrder })
				.skip(options.limit * (options.page - 1))
				.limit(options.limit);
		} else {
			return Model[model].find(criteria, projection, options);
		}
	};

	Services.getPaginatedMany = async (criteria, projection, options = {}) => {
		options.lean = true;
		options.virtuals = true;
		try { options.page = parseInt(options.page); } catch (e) { options.page = 1; }
		try { options.limit = parseInt(options.limit); } catch (e) { options.limit = 10; }

		if (!options.sortKey) options.sortKey = 'createdAt';
		if (!options.sortOrder) options.sortOrder = -1;

		return new Promise((resolve, reject) => {
			Model[model].find(criteria, projection, options)
				.sort({ [options.sortKey]: options.sortOrder })
				.skip(options.limit * (options.page - 1))
				.limit(options.limit)
				.exec(function (err1, data) {
					if (err1) reject(err1);
					Model[model].count(criteria).exec(function (err2, count) {
						if (err2) reject(err2);
						resolve({
							data,
							prev: options.page > 1 ? options.page - 1 : null,
							current: options.page,
							next: options.page * options.limit < count ? options.page + 1 : null,
							count,
							pages: count / options.limit < 1 ? 1 : Math.ceil(count / options.limit),
						});
					});
				});
		});
	};

	Services.getPopulatedMany = async (
		criteria,
		projection,
		populateQuery,
		options = {},
	) => {
		options.lean = true;
		options.virtuals = true;
		return Model[model]
			.find(criteria, projection, options)
			.populate(populateQuery)
			.exec();
	};

	Services.getPaginatedPopulatedMany = async (criteria, projection, populateQuery, options = {}) => {
		options.lean = true;
		options.virtuals = true;

		try { options.page = parseInt(options.page); } catch (e) { options.page = 1; }
		try { options.limit = parseInt(options.limit); } catch (e) { options.limit = 10; }

		if (!options.sortKey) options.sortKey = 'createdAt';
		if (!options.sortOrder) options.sortOrder = -1;

		return new Promise((resolve, reject) => {
			Model[model].find(criteria, projection, options)
				.sort({ [options.sortKey]: options.sortOrder })
				.skip(options.limit * (options.page - 1))
				.limit(options.limit)
				.populate(populateQuery)
				.exec(function (err1, data) {
					if (err1) reject(err1);
					Model[model].count(criteria).exec(function (err2, count) {
						if (err2) reject(err2);
						resolve({
							data,
							prev: options.page > 1 ? options.page - 1 : null,
							current: options.page,
							next: options.page * options.limit < count ? options.page + 1 : null,
							count,
							pages: count / options.limit < 1 ? 1 : Math.ceil(count / options.limit),
						});
					});
				});
		});
	};

	Services.updateOne = async (criteria, dataToUpdate, options = {}) => {
		options.new = true;
		options.lean = true;
		options.useFindAndModify = false;
		options.virtuals = true;
		return Model[model].findOneAndUpdate(criteria, dataToUpdate, options);
	};

	Services.updateMany = async (criteria, dataToUpdate, options = {}) => {
		options.new = true;
		options.lean = true;
		options.virtuals = true;
		return Model[model].updateMany(criteria, dataToUpdate, options);
	};

	Services.deleteOne = async (criteria) => {
		return Model[model].deleteOne(criteria);
	};

	Services.deleteMany = async (criteria) => {
		return Model[model].deleteMany(criteria);
	};

	Services.count = async (criteria) => {
		return Model[model].count(criteria);
	};

	Services.aggregate = async (group) => {
		return Model[model].aggregate(group);
	};

	return Services;
};
