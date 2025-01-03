/**
 * tests/integration/quiz.routes.test.js
 */
import request from "supertest";
import app from "../../src/app"; // Your Express app entry point
import { db } from "../../src/services/db";

describe("Quiz Routes Integration Tests", () => {
  beforeAll((done) => {
    // Possibly clear or load DB data before tests
    db.remove({}, { multi: true }, () => {
      done();
    });
    
  });

  afterAll(async () => {
    // If there's some resource to close, do it here.
    // For example, if you had a DB connection open:
    await db.close();
  });

  it("POST /api/v1/quiz -> creates a quiz", async () => {
    const res = await request(app)
      .post("/api/v1/quiz")
      .send({
        title: "Sample Quiz",
        questions: [
          { text: "Q1?", options: ["A", "B"], correctOption: 1 },
        ],
      })
      .expect(201);

    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Sample Quiz");
    expect(res.body.data.questions.length).toBe(1);
  });

  it("GET /api/v1/quiz/:id -> fetch quiz, hide correctOption", async () => {
    // We'll create a quiz first
    const createRes = await request(app)
      .post("/api/v1/quiz")
      .send({
        title: "Math Quiz",
        questions: [
          { text: "2+2?", options: ["3", "4"], correctOption: 1 },
        ],
      });
    const quizId = createRes.body.data.id;

    const getRes = await request(app)
      .get(`/api/v1/quiz/${quizId}`)
      .expect(200);

    const quizDoc = getRes.body.data;
    expect(quizDoc.title).toBe("Math Quiz");
    expect(quizDoc.questions[0].correctOption).toBeUndefined(); // hidden
  });

  it("POST api/v1/quiz/submit -> submit an answer", async () => {
    // Assume your route is actually /api/quizzes/submit or /api/quizzes/:id/submit
    const res = await request(app)
      .post("/api/v1/quiz/submit")
      .send({
        quizId: "someQuizId",
        questionId: "someQuestionId",
        userId: "testUser",
        selectedOption: 0,
      })
      .expect(200);

    expect(res.body.data).toHaveProperty("message"); // "Incorrect!" or "Correct!"
  });
});
