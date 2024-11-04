import React, { useState } from 'react';
import Header from './Header'; // Import the Header component

const questions = [
  {
    question: 'What is your favorite color?',
    answers: ['Red', 'Blue', 'Green', 'Yellow']
  },
  {
    question: 'What is your favorite animal?',
    answers: ['Dog', 'Cat', 'Bird', 'Fish']
  },
  {
    question: 'What is your favorite food?',
    answers: ['Pizza', 'Sushi', 'Tacos', 'Burgers']
  },
  {
    question: 'What is your favorite hobby?',
    answers: ['Reading', 'Writing', 'Drawing', 'Playing music']
  },
  {
    question: 'What is your favorite sport?',
    answers: ['Football', 'Basketball', 'Baseball', 'Soccer']
  },
  {
    question: 'What is your favorite type of music?',
    answers: ['Rock', 'Pop', 'Hip hop', 'Classical']
  },
  {
    question: 'What is your favorite type of movie?',
    answers: ['Action', 'Comedy', 'Romance', 'Horror']
  }
];

export const DetailedQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handlePrevious = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion - 1);
  };

  const handleNext = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: event.target.value }));
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <h2>{questions[currentQuestion].question}</h2>
          {questions[currentQuestion].answers.map((answer, index) => (
            <div key={index}>
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={answers[currentQuestion] === answer}
                onChange={handleAnswerChange}
              />
              <span>{answer}</span>
            </div>
          ))}
          <div>
            <button onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </button>
            <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedQuestions;