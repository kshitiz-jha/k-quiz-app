// models.js

// Quiz model
/* eslint-disable max-classes-per-file */
export class Quiz {
  /**
   * @param {string} id - Unique identifier for the quiz.
   * @param {string} title - Title of the quiz.
   * @param {Question[]} questions - List of Question objects.
   */
  constructor(id, title, questions) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }
}

// Question model
export class Question {
  /**
   * @param {string} id - Unique identifier for the question.
   * @param {string} text - The question text.
   * @param {string[]} options - List of answer options.
   * @param {number} correctOption - Index (0-based) of the correct answer.
   */
  constructor(id, text, options, correctOption) {
    this.id = id;
    this.text = text;
    this.options = options;
    this.correctOption = correctOption;
  }
}

// Answer model
export class Answer {
  /**
   * @param {string} questionId - ID of the question being answered.
   * @param {number} selectedOption - Index (0-based) of the selected answer.
   * @param {boolean} isCorrect - Whether the answer was correct.
   */
  constructor(questionId, selectedOption, isCorrect) {
    this.questionId = questionId;
    this.selectedOption = selectedOption;
    this.isCorrect = isCorrect;
  }
}

// Result model
export class Result {
  /**
   * @param {string} quizId - ID of the quiz.
   * @param {string} userId - ID of the user taking the quiz.
   * @param {number} score - The user’s score.
   * @param {Answer[]} answers - List of Answer objects.
   */
  constructor(quizId, userId, score, answers) {
    this.quizId = quizId;
    this.userId = userId;
    this.score = score;
    this.answers = answers;
  }
}
