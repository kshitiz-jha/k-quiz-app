/**
 * tests/unit/quiz.controller.test.js
 */
import httpStatus from "http-status";
import QuizController from "../../src/api/quiz/quiz.controller"; // or wherever your file is
import quizService from "../../src/api/quiz/quiz.service";       // The real service
import { Response } from "../../src/helpers";                       // Custom response helper

// Mocking the quizService
jest.mock("../../src/api/quiz/quiz.service", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  // ... any other methods you need to mock
}));

// Mocking Response so we can track what gets sent
jest.mock("../../src/helpers/response", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("QuizController Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQuiz", () => {
    it("should create a quiz and return 201", async () => {
      // Arrange
      // The service.create(...) will return a mock doc
      quizService.create.mockResolvedValueOnce({ id: "mockId", title: "Test", questions: [] });

      // We mimic a req/res/next
      const req = { body: { title: "Test", questions: [] } };
      const res = {};
      const next = jest.fn();

      // Act
      await QuizController.createQuiz(req, res, next);

      // Assert
      expect(quizService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "quiz",
          title: "Test",
          questions: [],
        })
      );
      // The response helper success should have been called with the doc
      expect(Response.success).toHaveBeenCalledWith(
        res,
        { id: "mockId", title: "Test", questions: [] },
        httpStatus.CREATED
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors and call next(error)", async () => {
      // Suppose service throws an error
      const fakeError = new Error("Create error");
      quizService.create.mockRejectedValueOnce(fakeError);

      const req = { body: { title: "Test", questions: [] } };
      const res = {};
      const next = jest.fn();

      await QuizController.createQuiz(req, res, next);
      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  // Similar tests for getQuiz, submitAnswer, getResults, etc.

  describe("getQuiz", () => {
    it("should fetch quiz doc and hide correctOption", async () => {
      // mock findOne
      quizService.findOne.mockResolvedValueOnce({
        id: "someId",
        title: "Test Quiz",
        questions: [{ id: "q1", text: "?", correctOption: 2 }],
      });

      const req = { params: { id: "someId" } };
      const res = {};
      const next = jest.fn();

      await QuizController.getQuiz(req, res, next);

      // We verify that Response.success is called with sanitized quiz
      expect(Response.success).toHaveBeenCalledWith(
        res,
        {
          id: "someId",
          title: "Test Quiz",
          questions: [{ id: "q1", text: "?" }], // no correctOption in response
        },
        httpStatus.OK
      );
    });

    it("should return 404 if quiz not found", async () => {
      quizService.findOne.mockResolvedValueOnce(null);

      const req = { params: { id: "notfound" } };
      const res = {};
      const next = jest.fn();

      await QuizController.getQuiz(req, res, next);

      expect(Response.error).toHaveBeenCalledWith(
        res,
        { code: "QUIZ_NOT_FOUND", message: "No quiz found with id notfound" },
        httpStatus.NOT_FOUND
      );
    });
  });
});
