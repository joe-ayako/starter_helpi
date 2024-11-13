import React, { useState } from 'react';
import './App.css';
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap';

interface Question {
  question: string;
  answers: string[];
}

interface QuestionsProps {
  questions: Question[];
}

const basicQuestions: Question[] = [
  { question: 'What type of work environment do you prefer?', answers: ['Fast-paced', 'Structured', 'Flexible', 'Collaborative'] },
  { question: 'How would you describe your ideal job?', answers: ['Creative', 'Analytical', 'Hands-on', 'People-oriented'] },
  { question: 'Which skill do you enjoy using most?', answers: ['Problem-solving', 'Communication', 'Creativity', 'Organization'] },
  { question: 'What is your priority in a career?', answers: ['Job security', 'High earning potential', 'Work-life balance', 'Passion-driven work'] },
  { question: 'How do you prefer to work on tasks?', answers: ['Independently', 'In a team', 'With clear instructions', 'With room for improvisation'] },
  { question: 'What industry interests you most?', answers: ['Technology', 'Healthcare', 'Business', 'Arts'] },
  { question: 'How do you approach new challenges?', answers: ['By researching solutions', 'By collaborating with others', 'By brainstorming ideas', 'By diving in and adjusting as needed'] },
];


const detailedQuestions: Question[] = [
  { 
    question: 'When working on a project, what approach do you usually take to problem-solving?', 
    answers: [
      'I break down the problem into smaller parts and tackle each one step-by-step.',
      'I prefer to brainstorm ideas with a team to find the best solution.',
      'I try to find a creative or unconventional approach to the problem.',
      'I rely on established procedures or guidelines to solve the issue.'
    ] 
  },
  { 
    question: 'How important is work-life balance to you, and how do you maintain it?', 
    answers: [
      'It’s very important; I stick to a set schedule and prioritize personal time.',
      'I’m okay with a demanding schedule if it helps me advance my career.',
      'I prefer flexibility to adjust my work hours as needed for a healthy balance.',
      'I focus on work first, but I make sure to take time off to recharge when needed.'
    ] 
  },
  { 
    question: 'What role do you enjoy playing in team projects?', 
    answers: [
      'I like to lead and organize tasks for the team.',
      'I prefer being a supportive team member, helping others when needed.',
      'I enjoy taking on specific tasks independently within a team setting.',
      'I like to contribute ideas and suggestions to improve the project.'
    ] 
  },
  { 
    question: 'When learning new skills, how do you typically approach the process?', 
    answers: [
      'I follow a structured course or guide to learn step-by-step.',
      'I dive in and learn as I go, experimenting to figure things out.',
      'I seek out mentors or colleagues who can guide me.',
      'I study relevant resources and apply what I learn at my own pace.'
    ] 
  },
  { 
    question: 'How do you handle stress or high-pressure situations at work?', 
    answers: [
      'I stay calm, focus on priorities, and work through each task logically.',
      'I reach out to others for support and try to share the workload.',
      'I use stress as motivation to work harder and stay focused.',
      'I take breaks or find activities outside work to reduce stress.'
    ] 
  },
  { 
    question: 'What type of recognition motivates you the most in a job?', 
    answers: [
      'Promotions or increased responsibilities.',
      'Appreciation from my team and superiors.',
      'Public recognition or awards.',
      'Personal satisfaction from achieving high standards.'
    ] 
  },
  { 
    question: 'Which best describes your ideal career path over the next 5-10 years?', 
    answers: [
      'Advancing into leadership or management roles.',
      'Building expertise in my field and becoming a go-to specialist.',
      'Exploring different roles to find a career I truly love.',
      'Starting my own business or working independently.'
    ] 
  }
];


const saveKeyData = 'MYKEY';
const prevKey = localStorage.getItem(saveKeyData);
const initialKeyData: string = prevKey ? JSON.parse(prevKey) : '';

const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const handlePrevious = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: value }));
  };

  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / questions.length) * 100);

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const allAnswered = answeredQuestions === questions.length;

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

          {/* Submit button when all questions are answered */}
          {allAnswered && !showSubmitModal && (
            <Button variant="success" onClick={handleSubmit} style={{ marginTop: '20px' }}>
              Submit
            </Button>
          )}

          {/* Modal for Submit */}
          <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Submit Your Answers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to submit your answers?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => alert('Your answers have been submitted!')}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<{ setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ setPage }) => {
  return (
    <header style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <button onClick={() => setPage('home')}>Go to Home</button>
    </header>
  );
};

const App: React.FC = () => {
  const [key, setKey] = useState<string>(initialKeyData);
  const [page, setPage] = useState<string>('home'); // Home page as default

  const handleSubmit = () => {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload();
  };

  const changeKey = (event: React.ChangeEvent<HTMLInputElement>) => setKey(event.target.value);

  return (
    <div className="App">
      <Header setPage={setPage} />
      {page === 'home' && (
        <div>
          <h1>Welcome to the Career Quiz</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <Button variant="primary" onClick={() => setPage('detailed')}>
                Detailed Questions
              </Button>
              <p>This is a longer quiz that will provide a more thorough look into your future career and possible paths.</p>
            </div>
            <div>
              <Button variant="primary" onClick={() => setPage('basic')}>
                Basic Questions
              </Button>
              <p>This is a shorter quiz intended for quick insights into potential career options.</p>
            </div>
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
      {page === 'basic' && <Questions questions={basicQuestions} />}
      {page === 'detailed' && <Questions questions={detailedQuestions} />}
    </div>
  );
};

export default App;
