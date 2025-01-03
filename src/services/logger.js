Object.defineProperty(exports, "__esModule", {
  value: true,
});

function _interopRequireDefault(obj) {
  return obj?.__esModule ? obj : { default: obj };
}

const _winston = require("winston");
const _config = _interopRequireDefault(require("../config"));

/**
 * @typedef {import("winston").Logger} Logger
 * @typedef {import("winston").Logform.Format} Format
 */
/**
 * Formats the error message in the log entry.
 *
 * @param {Object} info - The log information object.
 * @returns {Object} The formatted log information object.
 */
const enumerateErrorFormat = (0, _winston.format)((info) => {
  if (info instanceof Error) {
    Object.assign(info, {
      message: info.stack,
    });
  }
  return info;
});

/**
 * Defines the log format for the console.
 *
 * @returns {Format} The log format configuration.
 */
const consoleLogFormat = () =>
  _winston.format.combine(
    enumerateErrorFormat(),
    _config.default.env === "development"
      ? _winston.format.colorize()
      : _winston.format.uncolorize(),
    _winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    _winston.format.splat(),
    // format.json()
    _winston.format.printf(
      (info) =>
        `${info.timestamp.toLocaleString()} ${
          info.level
        } [${info.label?.substring(
          info.label?.indexOf("src/")
        )}]: ${JSON.stringify(info.message)}`
    )
  );

/**
 * The logger instance.
 *
 * @type {Logger}
 */
const logger = (0, _winston.createLogger)({
  level:
    _config.default.env !== "production" ? _config.default.logLevel : "error",
  format: consoleLogFormat(),
  transports: [
    new _winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});
exports.logger = logger;
