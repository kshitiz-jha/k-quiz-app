import { logger } from "../services/logger";

/**
 * @typedef {import("winston").Logger} Logger
 */

/**
 * Retrieves a child logger with a specific module name.
 *
 * @param {string} moduleName - The name of the module.
 * @returns {Logger} The child logger instance.
 */
export const getLogger = (moduleName) => {
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
