# React Quiz App

A responsive Quiz App built with React that fetches multiple-choice questions from the **Open Trivia DB API**.  
Features include: timer per question, skip, previous, next, score tracking, and results summary.

---

## Features

- Single question view with 4 options
- Timer for each question (30 seconds)
- Skip and Previous buttons
- Real-time score tracking
- Results page showing correct/incorrect answers
- Restart quiz functionality
- Responsive UI for desktop and mobile

---

## Demo

You can see the live demo here:  
[Insert your live demo link here if deployed]

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/shivam846/quiz-app.git
cd quiz-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

- The app will open in your default browser at `http://localhost:3000`.

---

## Project Structure

```
quiz-app/
├── public/
├── src/
│   ├── components/
│   │   ├── QuestionCard.js
│   │   ├── ScoreBoard.js
│   │   └── Results.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   └── QuizPage.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## Dependencies

- React
- React Router DOM

---

## How to Use

1. Open the app in your browser.
2. Click **Start Quiz** on the home page.
3. Answer questions within the 30-second timer.
4. Use **Next**, **Previous**, or **Skip** to navigate.
5. Submit the quiz to view your score and correct/incorrect answers.
6. Click **Restart Quiz** to play again.

---

## License

This project is open-source and free to use.
