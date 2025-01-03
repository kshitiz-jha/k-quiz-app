import httpStatus from "http-status";
import { isCelebrateError, Segments } from "celebrate";
import { Response } from "../helpers";

const getParsedCelebrateErrorList = (error) => {
  const { details } = error; // detail is a Map object

  const parsedErrorList = [];
  if (details.has(Segments.QUERY)) {
    details.get(Segments.QUERY).details.forEach(({ message, type }) => {
      parsedErrorList.push({
        message: message.replace(/['"]/g, ""),
        type,
      });
    });
  }
  if (details.has(Segments.BODY)) {
    details.get(Segments.BODY).details.forEach(({ message, type }) => {
      parsedErrorList.push({
        message: message.replace(/['"]/g, ""),
        type,
      });
    });
  }
  if (details.has(Segments.PARAMS)) {
    details.get(Segments.PARAMS).details.forEach(({ message, type }) => {
      parsedErrorList.push({
        message: message.replace(/['"]/g, ""),
        type,
      });
    });
  }
  if (details.has(Segments.HEADERS)) {
    details.get(Segments.HEADERS).details.forEach(({ message, type }) => {
      parsedErrorList.push({
        message: message.replace(/['"]/g, ""),
        type,
      });
    });
  }
  return parsedErrorList;
};

// eslint-disable-next-line no-unused-vars
export const errorHandle = (error, _req, res, _next) => {
  if (typeof error === "string") {
    // custom application error
    return Response.error(res, { message: error });
  }
  if (isCelebrateError(error)) {
    // request schema validation raise by celebrate
    const parsedErrorList = getParsedCelebrateErrorList(error);
    return Response.error(res, {
      message: error.message,
      code: error.name,
      errors: parsedErrorList,
    });
  }
  if (error.name === "CastError" && error.kind === "ObjectId") {
    // Error by mongoose for wrong objectId
    return Response.error(res, {
      // code: error.name,
      message: "invalid id",
    });
  }
  if (error.name === "ValidationError") {
    // error generated by mongoose
    return Response.error(res, {
      message: error.message,
    });
  }
  if (error.name === "MongoServerError") {
    if (error.code === 11000) {
      // occurred when unique property is inserted again
      return Response.error(
        res,
        {
          message: "Duplicate record",
        },
        httpStatus.CONFLICT
      );
    }
    return Response.error(
      res,
      {
        message: error.message,
      },
      httpStatus.BAD_REQUEST
    );
  }
  if (error.name === "NotFound") {
    return Response.error(res, error, httpStatus.NOT_FOUND);
  }
  return Response.error(
    res,
    {
      message: error.message,
    },
    httpStatus.INTERNAL_SERVER_ERROR
  );
};