import { Router } from "express";
import quizRouter from "../../quiz";

const v1Router = new Router();

v1Router.use("/quiz", quizRouter);

export default v1Router;
