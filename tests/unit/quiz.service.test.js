/**
 * tests/unit/quiz.service.test.js
 */
import quizService from "../../src/api/quiz/quiz.service";
import { db } from "../../src/services/db";

jest.mock("../../src/services/db", () => {
  const DatastoreMock = {
    insert: jest.fn(),
    findOne: jest.fn(),
    // etc.
  };
  return { db: DatastoreMock };
});

describe("QuizService Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new quiz record", async () => {
    db.insert.mockImplementation((data, cb) => {
      cb(null, { _id: "mongoId", ...data });
    });

    const doc = await quizService.create({ title: "Test" });
    expect(doc).toEqual({ _id: "mongoId", title: "Test" });
    expect(db.insert).toHaveBeenCalledWith(
      { title: "Test" },
      expect.any(Function)
    );
  });

  it("should handle findOne correctly", async () => {
    db.findOne.mockImplementation((query, cb) => {
      cb(null, { _id: "testId", ...query });
    });

    const found = await quizService.findOne({ type: "quiz", id: "abc" });
    expect(found).toEqual({ _id: "testId", type: "quiz", id: "abc" });
  });
});
