// Service.js
/**
 * A service class for interacting with a NeDB datastore.
 */
class Service {
  /**
   * Creates an instance of Service.
   * @param {Datastore} model - The NeDB datastore (instead of a Mongoose Model).
   */
  constructor(model) {
    this._model = model;

    // Bind "this" so you can pass these methods around if needed
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.findOne = this.findOne.bind(this);
    this.find = this.find.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  /**
   * Finds all records with optional pagination and sorting.
   * Since NeDB doesn't have a built-in paginate, we'll mimic it.
   * @async
   * @param {Object} query - The query parameters.
   * @param {Object} query.filter - The filter object.
   * @param {number} query.skip - The page number (1-based).
   * @param {number} query.limit - The max number of records per page.
   * @param {string} query.sort - Sort order (e.g. '-createdAt' or 'createdAt').
   * @param {string|Array<string>} query.population - (Ignored; not applicable in NeDB).
   * @param {Object} options - Additional options (ignored for simplicity).
   * @returns {Promise<Object>} Paginated result with { docs, totalDocs, page, limit, totalPages }
   */
  async findAll(query) {
    const {
      filter = {},
      skip = 1, // treat skip as a 1-based page number
      limit = 25,
      sort = null,
    } = query;

    const page = Number(skip) || 1;
    const perPage = Number(limit) || 25;
    const skipDocs = (page - 1) * perPage;

    // Parse sort string (e.g. '-createdAt' -> { createdAt: -1 })
    let sortObj = {};
    if (sort && typeof sort === "string") {
      const direction = sort.startsWith("-") ? -1 : 1;
      const field = sort.replace(/^[-+]/, "");
      sortObj = { [field]: direction };
    }

    // 1) Count total
    const totalDocs = await new Promise((resolve, reject) => {
      this._model.count(filter, (err, count) => {
        if (err) return reject(err);
        resolve(count);
      });
    });

    // 2) Query with skip, limit, sort
    const docs = await new Promise((resolve, reject) => {
      this._model
        .find(filter)
        .sort(sortObj)
        .skip(skipDocs)
        .limit(perPage)
        .exec((err, foundDocs) => {
          if (err) return reject(err);
          resolve(foundDocs);
        });
    });

    return {
      docs,
      totalDocs,
      page,
      limit: perPage,
      totalPages: Math.ceil(totalDocs / perPage),
    };
  }

  /**
   * Finds a record by its NeDB-generated _id.
   */
  async findById(id) {
    return new Promise((resolve, reject) => {
      this._model.findOne({ _id: id }, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  /**
   * Finds a single record based on the provided data.
   */
  async findOne(data) {
    return new Promise((resolve, reject) => {
      this._model.findOne(data, (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      });
    });
  }

  /**
   * Finds multiple records based on the provided data.
   */
  async find(data) {
    return new Promise((resolve, reject) => {
      this._model.find(data, (err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
  }

  /**
   * Creates a new record.
   */
  async create(data) {
    return new Promise((resolve, reject) => {
      this._model.insert(data, (err, newDoc) => {
        if (err) return reject(err);
        resolve(newDoc);
      });
    });
  }

  /**
   * Updates a record by its _id.
   */
  async update(id, data) {
    return new Promise((resolve, reject) => {
      // find existing doc
      this._model.findOne({ _id: id }, (errFind, doc) => {
        if (errFind) return reject(errFind);
        if (!doc) return resolve(null);

        // merge updated fields
        const updatedDoc = { ...doc, ...data };
        this._model.update({ _id: id }, updatedDoc, {}, (errUpdate) => {
          if (errUpdate) return reject(errUpdate);
          // return the updated doc
          resolve(updatedDoc);
        });
      });
    });
  }

  /**
   * Removes a record by its _id.
   */
  async remove(id) {
    return new Promise((resolve, reject) => {
      // find doc so we can return it after removal
      this._model.findOne({ _id: id }, (errFind, doc) => {
        if (errFind) return reject(errFind);
        if (!doc) return resolve(null);

        // remove doc
        this._model.remove({ _id: id }, {}, (errRemove) => {
          if (errRemove) return reject(errRemove);
          // return removed doc
          resolve(doc);
        });
      });
    });
  }
}

export default Service;
