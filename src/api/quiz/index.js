import express from "express";
import { celebrate, Segments } from "celebrate";
import quizController from "./quiz.controller";
import {
  getByIdSchema,
  getResultsSchema,
  quizSchema,
  submitQuizSchema,
} from "./validationSchema";

const quizRouter = express.Router();

quizRouter.get(
  "/:quizId/results/:userId",
  celebrate(
    { [Segments.PARAMS]: getResultsSchema },
    { abortEarly: false, allowUnknown: false }
  ),
  quizController.getResults
);

quizRouter.post(
  "/",
  celebrate(
    { [Segments.BODY]: quizSchema },
    { abortEarly: false, allowUnknown: false }
  ),
  quizController.createQuiz
);

quizRouter.post(
  "/submit",
  celebrate(
    { [Segments.BODY]: submitQuizSchema },
    { abortEarly: false, allowUnknown: false }
  ),
  quizController.submitAnswer
);

quizRouter.get(
  "/:id",
  celebrate(
    { [Segments.PARAMS]: getByIdSchema },
    { abortEarly: false, allowUnknown: false }
  ),
  quizController.getQuiz
);

export default quizRouter;
