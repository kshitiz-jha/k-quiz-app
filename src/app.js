import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import httpStatus from "http-status";
import helmet from "helmet";
import { getLogger } from "./utils/logger";
import { ApiError } from "./utils";
import { errorHandle } from "./middleware";
import v1Routes from "./api/routes/v1";

const logger = getLogger(__filename);

const initApp = () => {
  const app = express();

  app.use(helmet()); // applying security headers to the services
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(compression());
  app.use(cors());

  // logs http request
  app.use(
    morgan("dev", {
      stream: logger.child({ label: __filename }).stream,
    })
  );

  app.use("/public", express.static("public"));

  app.get("/", (_, res) =>
    res.json({
      status: "success",
      data: {
        message: "Service running",
      },
    })
  );

  app.use("/api/v1", v1Routes);

  app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found", "NotFound"));
  });

  app.use(errorHandle);
  return app;
};

export default initApp;
