import React, { useState } from 'react';
import './App.css';
import { Button, Form, ProgressBar } from 'react-bootstrap';

interface Question {
  question: string;
  answers: string[];
}

interface QuestionsProps {
  questions: Question[];
}

const basicQuestions: Question[] = [
  { question: 'What is your favorite color?', answers: ['Red', 'Blue', 'Green', 'Yellow'] },
  { question: 'What is your favorite animal?', answers: ['Dog', 'Cat', 'Bird', 'Fish'] },
  { question: 'What is your favorite food?', answers: ['Pizza', 'Sushi', 'Tacos', 'Burgers'] },
  { question: 'What is your favorite hobby?', answers: ['Reading', 'Writing', 'Drawing', 'Playing music'] },
  { question: 'What is your favorite sport?', answers: ['Football', 'Basketball', 'Baseball', 'Soccer'] },
  { question: 'What is your favorite type of music?', answers: ['Rock', 'Pop', 'Hip hop', 'Classical'] },
  { question: 'What is your favorite type of movie?', answers: ['Action', 'Comedy', 'Romance', 'Horror'] },
];

const detailedQuestions: Question[] = [
  { question: 'What is your favorite color?', answers: ['Red', 'Blue', 'Green', 'Yellow'] },
  { question: 'What is your favorite animal?', answers: ['Dog', 'Cat', 'Bird', 'Fish'] },
  { question: 'What is your favorite cuisine?', answers: ['Italian', 'Chinese', 'Mexican', 'Indian'] },
  { question: 'What are your hobbies?', answers: ['Reading', 'Traveling', 'Cooking', 'Photography'] },
  { question: 'What sports do you enjoy?', answers: ['Tennis', 'Golf', 'Rugby', 'Hockey'] },
  { question: 'What is your favorite type of art?', answers: ['Painting', 'Sculpture', 'Photography', 'Dance'] },
  { question: 'What genres of movies do you prefer?', answers: ['Sci-Fi', 'Drama', 'Documentary', 'Thriller'] },
];

const saveKeyData = 'MYKEY';
const prevKey = localStorage.getItem(saveKeyData);
const initialKeyData: string = prevKey ? JSON.parse(prevKey) : '';

const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handlePrevious = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: value }));
  };

  // Calculate how many questions are answered
  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / questions.length) * 100);

  return (
    <div>
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

          {/* Progress Bar */}
          <ProgressBar now={progress} label={`${progress}%`} style={{ marginTop: '20px' }} />
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/">
        <button>Go to Home</button>
      </a>
    </header>
  );
};

const App: React.FC = () => {
  const [key, setKey] = useState<string>(initialKeyData);
  const [page, setPage] = useState<string>(window.location.pathname);

  const handleNavigation = (path: string) => {
    setPage(path);
    window.history.pushState({}, '', path);
  };

  const handleSubmit = () => {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload();
  };

  const changeKey = (event: React.ChangeEvent<HTMLInputElement>) => setKey(event.target.value);

  return (
    <div className="App">
      <Header />
      {page === '/basic' ? (
        <Questions questions={basicQuestions} />
      ) : page === '/detailed' ? (
        <Questions questions={detailedQuestions} />
      ) : (
        <div>
          <div>
            <Button variant="primary" onClick={() => handleNavigation('/detailed')}>
              Detailed Questions
            </Button>
            <p>This is a longer quiz that will provide a more thorough look into your future career and possible paths.</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => handleNavigation('/basic')}>
              Basic Questions
            </Button>
            <p>This is a shorter quiz intended for quick insights into potential career options.</p>
          </div>
          <Form>
            <Form.Label>API Key:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Insert API Key Here"
              value={key}
              onChange={changeKey}
            />
            <br />
            <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default App;
