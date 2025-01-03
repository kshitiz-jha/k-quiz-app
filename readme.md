# Quiz API

This README provides **exact** setup instructions for running and testing the Quiz API both **locally** and via **Docker**—no extra conditions.

---

## 1. Local Setup

### 1.1 Clone the Repository
```bash
git clone https://github.com/your-username/quiz-api.git
cd quiz-api
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Run in Development
```bash
npm run dev
```
Runs the app (often with nodemon). The API is typically available at `http://localhost:3000`.

### 1.4 Run in Production
```bash
npm start
```
Starts the app without watch mode.

### 1.5 Test the Application
```bash
npm test
```
Executes unit and integration tests (using Jest + Supertest).

To see coverage (if configured), run:
```bash
npm run test:coverage
```
If you encounter "Jest has detected open handles," ensure no leftover DB or server handles remain open.

---

## 2. Docker Setup

### 2.1 Build the Docker Image
```bash
docker build -t quiz-api .
```

### 2.2 Run the Container
```bash
docker run -p 3000:3000 quiz-api
```
This maps container port 3000 to host port 3000.

Access the API at `http://localhost:3000`.

### 2.3 Run Tests in Docker (Optional)
```bash
docker run -it quiz-api npm test
```
Executes the same Jest test suite inside the container.

---

## 3. Main Endpoints

### 3.1 Create a Quiz
**Method**: `POST /api/v1/quiz`

**Body Example:**
```json
{
  "title": "Sample Quiz",
  "questions": [
    {
      "text": "What is 2 + 2?",
      "options": ["1", "2", "3", "4"],
      "correctOption": 3
    }
  ]
}
```

**Response**: `201 Created` with `{ data: { ...quizFields } }`.

### 3.2 Submit an Answer
**Method**: `POST /api/v1/quiz/submit`

**Body Example:**
```json
{
  "quizId": "some-quiz-id",
  "questionId": "uuid-of-question",
  "userId": "testUser",
  "selectedOption": 3
}
```

**Response:**
```json
{
  "data": {
    "message": "Correct!",
    "is_correct": true
  }
}
```
or
```json
{
  "data": {
    "message": "Incorrect!",
    "is_correct": false,
    "correctOption": 3
  }
}
```

### 3.3 Get a Quiz (Hide Correct Answers)
**Method**: `GET /api/v1/quiz/:id`

**Response**: `200 OK` with quiz data but without the `correctOption` field.

### 3.4 Get Results
**Method**: `GET /api/v1/quiz/results?quizId=...&userId=...`

**Response Example:**
```json
{
  "data": {
    "quizId": "abc123",
    "userId": "johnDoe",
    "score": 2,
    "answers": [
      {
        "questionId": "q1",
        "selectedOption": 1,
        "isCorrect": true
      },
      {
        "questionId": "q2",
        "selectedOption": 0,
        "isCorrect": false
      }
    ]
  }
}
```

---

## 4. Notes

- **NeDB** is file-based and will store data in a file (e.g., `quizzes.db`).
- Validation is handled via **celebrate** and **Joi**.
- If you modify the port or environment, set `PORT` (or similar) in `.env`.