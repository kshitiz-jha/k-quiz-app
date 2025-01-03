import httpStatus from "http-status";
import aqp from "api-query-params";
import Response from "../response";

/**
 * Retrieves the query parameters from the request.
 * @param {Object} req - The request object.
 * @returns {Object} The parsed query parameters.
 */
function getQuerySet(req) {
  const params = aqp(req.query, {
    skipKey: "page",
  });
  return params;
}

/**
 * @typedef {import("./Service").default} Service
 */

/**
 * Controller class for handling HTTP requests and responses.
 */
class Controller {
  /**
   * Creates an instance of Controller.
   * @param {Service} service - The service instance to use.
   * @param {string} name - The name of the controller.
   */
  constructor(service, name) {
    /**
     * The service instance.
     * @type {Service}
     */
    this.service = service;

    /**
     * The name of the controller.
     * @type {string}
     * @private
     */
    this._name = name;

    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.getQuerySet = getQuerySet.bind(this);
  }

  /**
   * Creates a new record.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @returns {Promise<void>} A promise that resolves when the operation is completed.
   */
  async create(req, res, next) {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      return Response.success(res, result, httpStatus.CREATED);
    } catch (exception) {
      next(exception);
    }
  }

  /**
   * Finds all records based on the provided query parameters.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @returns {Promise<void>} A promise that resolves when the operation is completed.
   */
  async findAll(req, res, next) {
    try {
      const query = this.getQuerySet(req);
      const result = await this.service.findAll(query);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  /**
   * Finds a record by its ID.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @returns {Promise<void>} A promise that resolves when the operation is completed.
   */
  async findOne(req, res, next) {
    try {
      const result = await this.service.findById(req.params.id);
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`,
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  /**
   * Updates a record by its ID.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @returns {Promise<void>} A promise that resolves when the operation is completed.
   */
  async update(req, res, next) {
    try {
      const result = await this.service.update(req.params.id, req.body, {
        new: true,
      });
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`,
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  /**
   * Removes a record by its ID.
   * @async
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @returns {Promise<void>} A promise that resolves when the operation is completed.
   */
  async remove(req, res, next) {
    try {
      const result = await this.service.remove(req.params.id);
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`,
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default Controller;
