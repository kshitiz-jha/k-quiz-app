import "dotenv/config";
import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test", "staging")
      .required(),
    PORT: Joi.number().default(3000),
    LOG_LEVEL: Joi.string()
      .valid("debug", "verbose", "info", "warning", "error")
      .default("debug"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  logLevel: envVars.LOG_LEVEL,
};
