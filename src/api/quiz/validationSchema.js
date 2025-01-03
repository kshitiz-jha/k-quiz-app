import Joi from "joi";

export const quizSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  questions: Joi.array().items(Joi.object()).required(),
});

export const getByIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const getResultsSchema = Joi.object({
  quizId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const submitQuizSchema = Joi.object({
  quizId: Joi.string().required(),
  userId: Joi.string().required(),
  questionId: Joi.string().required(),
  selectedOption: Joi.number().required(),
});
