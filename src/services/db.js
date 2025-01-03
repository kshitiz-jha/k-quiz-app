import Datastore from "nedb";
import path from "path";
import { getLogger } from "../utils/logger";

const logger = getLogger(__filename);

const db = new Datastore({
  filename: path.join(__dirname, "quizzes.db"),
  autoload: true,
});

const initDBConnection = async () => {
  return new Promise((resolve, reject) => {
    db.loadDatabase((errqload) => {
      if (errqload) {
        logger.error("Error loading quizzes database:", errqload);
        return reject(new Error(errqload));
      }
      resolve();
      logger.info("Quizzes database loaded successfully");
    });
  });
};

export default initDBConnection;
export { db };
