// quiz.controller.js
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import { Controller, Response } from "../../helpers";
import quizService from "./quiz.service"; // Now quizService uses db
import { Answer, Question, Quiz, Result } from "../../models/quiz.models";

import { getLogger } from "../../utils/logger";

const logger = getLogger(__filename);

class QuizController extends Controller {
  constructor() {
    super(quizService, "Quiz");
    // Pass the actual quizService so your base methods (findOne, etc.) also work
    // The second arg is the resource name ("Quiz")
  }

  /**
   * Creates a new quiz (type="quiz") using Quiz & Question models.
   * POST /api/quizzes
   */
  createQuiz = async (req, res, next) => {
    try {
      const { title, questions } = req.body;
      const quizId = uuidv4();
      const questionModels = questions.map((q) => {
        const qId = uuidv4();
        return new Question(qId, q.text, q.options, q.correctOption);
      });
      const newQuiz = new Quiz(quizId, title, questionModels);

      // Use the promise-based create
      const insertedDoc = await this.service.create({
        type: "quiz",
        id: newQuiz.id,
        title: newQuiz.title,
        questions: newQuiz.questions,
      });

      return Response.success(res, insertedDoc, httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };

  /**
   * getQuiz = GET /api/quizzes/:id
   * We can override base "findOne" logic or just do:
   */
  getQuiz = async (req, res, next) => {
    try {
      logger.info("Fetching quiz with id:", req.params.id);

      // Use the base "findOne" from the parent Controller if you like:
      const quizDoc = await this.service.findOne({
        type: "quiz",
        id: req.params.id,
      });
      if (!quizDoc) {
        return Response.error(
          res,
          {
            code: "QUIZ_NOT_FOUND",
            message: `No quiz found with id ${req.params.id}`,
          },
          httpStatus.NOT_FOUND
        );
      }
      // Remove correctOption
      const sanitized = {
        id: quizDoc.id,
        title: quizDoc.title,
        questions: quizDoc.questions.map(({ correctOption, ...rest }) => rest),
      };
      return Response.success(res, sanitized, httpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/quizzes/:quizId/questions/:questionId/submit
   * Body: { userId, quizId, questionId, selectedOption }
   */
  submitAnswer = async (req, res, next) => {
    try {
      const { userId, quizId, questionId, selectedOption } = req.body;

      // 1) Find the quiz
      const quizDoc = await this.service.findOne({ type: "quiz", id: quizId });
      if (!quizDoc) {
        return Response.error(
          res,
          { code: "QUIZ_NOT_FOUND", message: `No quiz with id ${quizId}` },
          httpStatus.NOT_FOUND
        );
      }

      // 2) Find question
      const question = quizDoc.questions.find((q) => q.id === questionId);
      if (!question) {
        return Response.error(
          res,
          {
            code: "QUESTION_NOT_FOUND",
            message: `No question with id ${questionId}`,
          },
          httpStatus.NOT_FOUND
        );
      }

      const isCorrect = question.correctOption === selectedOption;

      // 3) Find or create "result" doc
      let resultDoc = await this.service.findOne({
        type: "result",
        quiz_id: quizId,
        user_id: userId,
      });

      // If none found, create a new result
      if (!resultDoc) {
        const newResult = new Result(quizId, userId, 0, []);
        resultDoc = await this.service.create({
          type: "result",
          quiz_id: newResult.quizId,
          user_id: newResult.userId,
          score: newResult.score,
          answers: newResult.answers,
        });
      }

      // 4) Update or add the answer
      resultDoc.answers = resultDoc.answers || [];
      const idx = resultDoc.answers.findIndex(
        (a) => a.questionId === questionId
      );
      if (idx >= 0) {
        resultDoc.answers[idx].selectedOption = selectedOption;
        resultDoc.answers[idx].isCorrect = isCorrect;
      } else {
        const ansObj = new Answer(questionId, selectedOption, isCorrect);
        resultDoc.answers.push(ansObj);
      }

      // 5) Recompute score
      resultDoc.score = resultDoc.answers.filter((a) => a.isCorrect).length;

      // 6) Update the doc via the service
      await this.service.update(resultDoc._id, resultDoc);

      const feedback = {
        message: isCorrect ? "Correct!" : "Incorrect!",
        is_correct: isCorrect,
      };
      if (!isCorrect) {
        feedback.correctOption = question.correctOption;
      }
      return Response.success(res, feedback, httpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/quizzes/:quizId/results/:userId
   */
  getResults = async (req, res, next) => {
    try {
      const { quizId, userId } = req.params;
      const doc = await this.service.findOne({
        type: "result",
        quiz_id: quizId,
        user_id: userId,
      });
      if (!doc) {
        return Response.error(
          res,
          {
            code: "RESULT_NOT_FOUND",
            message: `No results for user=${userId}, quiz=${quizId}`,
          },
          httpStatus.NOT_FOUND
        );
      }
      // You can wrap doc in a new Result if you like
      const finalResult = new Result(
        doc.quiz_id,
        doc.user_id,
        doc.score,
        doc.answers
      );
      return Response.success(res, finalResult, httpStatus.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default new QuizController(); // Or pass the service & name to super if you like
