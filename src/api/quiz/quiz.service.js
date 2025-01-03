// quiz.service.js
// quiz.service.js
import { Service } from "../../helpers";
import { db } from "../../services/db"; // <--- NEDB instance, not the Quiz class

class QuizServices extends Service {}

// Instead of passing the Quiz model, pass the db so `_model.findOne()` etc. works
export default new QuizServices(db);
