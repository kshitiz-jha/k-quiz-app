require('dotenv').config();
const { createLogger, format, transports } =  require('winston');

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
const enumerateErrorFormat = format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

/**
 * Defines the log format for the console.
 *
 * @returns {Format} The log format configuration.
 */
const consoleLogFormat = () =>
	format.combine(
		enumerateErrorFormat(),
		process.env.ENVIRONMENT === 'development' ? format.colorize() : format.uncolorize(),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.splat(),
		// format.json() // for json format logs
		format.printf(
			(info) => `${info.timestamp} ${info.level} [${info.label?.substring(info.label?.indexOf('src/'))}]: ${info.message}`,
		),
	);

/**
 * The logger instance.
 *
 * @type {Logger}
 */
const logger = createLogger({
	level:  process.env.LOGLEVEL || 'info',
	format: consoleLogFormat(),
	transports: [
		new transports.Console({
			stderrLevels: ['error'],
		}),
	],
});






/**
 * @typedef {import("winston").Logger} Logger
 */

/**
 * Retrieves a child logger with a specific module name.
 *
 * @param {string} moduleName - The name of the module.
 * @returns {Logger} The child logger instance.
 */
const getLogger = (moduleName) => {
	const label = moduleName;
	const loggerChild = logger.child({ label });
	loggerChild.stream = {
		write(message) {
			// use the 'info' log level so the output will be picked up by both transports (file and console)
			loggerChild.info(message);
		},
	};
	return loggerChild;
};

module.exports = getLogger;



