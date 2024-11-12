import React, { useState } from 'react';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import Header from './Header';
import DetailedQuestions from './DetailedQuestions';

// Define constants for questions and answers
const basicQuestions = [
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

// Define constants for local storage and API key
let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);
if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

// Define the BasicQuestions component
const BasicQuestions = () => {
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
          <h2>{basicQuestions[currentQuestion].question}</h2>
          {basicQuestions[currentQuestion].answers.map((answer, index) => (
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
            <button onClick={handleNext} disabled={currentQuestion === basicQuestions.length - 1}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function navigateToDetailedQuestions() {
  window.location.href = '/detailed';
}

function navigateToBasicQuestions() {
  window.location.href = '/basic';
}

function App() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  const url = window.location.pathname;

  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  return (
    <div className="App">
      <Header />
      {url === '/detailed' ? (
        <DetailedQuestions />
      ) : url === '/basic' ? (
        <BasicQuestions />
      ) : (
        <div>
          <div>
            <Button variant="primary" onClick={() => navigateToDetailedQuestions()}>Detailed Questions</Button>
            <p>This is a longer quiz that will provide a more thorough look into your future career 
              and will give possible paths and options to pursue said careers.
            </p>
          </div>
          <div>
            <Button variant="primary" onClick={() => navigateToBasicQuestions()}>Basic Questions</Button>
            <p>This is a shorter quiz that is intended for people who want a quick answer and are curious
              about potential career options.
            </p>
          </div>
          <Form>
            <Form.Label>API Key:</Form.Label>
            <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
            <br></br>
            <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default App;

