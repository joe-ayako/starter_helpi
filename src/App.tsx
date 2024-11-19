import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap';

interface Question {
  question: string;
  answers: string[];
}

interface QuestionsProps {
  questions: Question[];
  quizType: 'basic' | 'detailed';
  onSubmit: (answers: { [key: number]: string }) => void;
}

interface APIKeyFormProps {
  onSubmit: (apiKey: string) => void;
  isKeySet: boolean;
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

const APIKeyForm: React.FC<APIKeyFormProps> = ({ onSubmit, isKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
    setApiKey('');
  };

  return (
    <div className="api-key-form">
      {!isKeySet ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Enter your ChatGPT API Key</Form.Label>
            <Form.Control
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Save API Key
          </Button>
        </Form>
      ) : (
        <p className="text-success">API Key is set ✓</p>
      )}
    </div>
  );
};

const Questions: React.FC<QuestionsProps> = ({ questions, quizType, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [careerReport, setCareerReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`${quizType}QuizAnswers`) || '{}');
    setAnswers(savedAnswers);
  }, [quizType]);

  const handlePrevious = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    localStorage.setItem(`${quizType}QuizAnswers`, JSON.stringify(answers));
    await onSubmit(answers);
    setShowSubmitModal(true);
    setIsLoading(false);
  };

  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / questions.length) * 100);
  const allAnswered = answeredQuestions === questions.length;

  return (
    <div className="quiz-container">
      <div className="question-card">
        <h2 className="question-text">{questions[currentQuestion].question}</h2>
        <div className="answers-list">
          {questions[currentQuestion].answers.map((answer, index) => (
            <label key={index} className="answer-option">
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={answers[currentQuestion] === answer}
                onChange={handleAnswerChange}
              />
              {answer}
            </label>
          ))}
        </div>
        <div className="navigation-buttons">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline-primary">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentQuestion === questions.length - 1} variant="outline-primary">
            Next
          </Button>
        </div>
        <ProgressBar now={progress} label={`${progress}%`} className="progress-bar" />
        {allAnswered && (
          <Button 
            variant="success" 
            onClick={handleSubmit} 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Report...' : 'Submit'}
          </Button>
        )}
        <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Career Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {careerReport || 'Your answers have been submitted and saved!'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

const Header: React.FC<{ setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ setPage }) => (
  <header className="app-header">
    <h1>Career Quizine</h1>
    <p>Your Ultimate Recipe for Career Success</p>
    <button onClick={() => setPage('home')} className="home-button">Home</button>
  </header>
);

const App: React.FC = () => {
  const [page, setPage] = useState<string>('home');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgptApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('chatgptApiKey', key);
    setApiKey(key);
  };

  const generateCareerReport = async (answers: { [key: number]: string }, quizType: 'basic' | 'detailed') => {
    try {
      const questionAnswerPairs = Object.entries(answers).map(([index, answer]) => {
        const question = (quizType === 'basic' ? basicQuestions : detailedQuestions)[parseInt(index)].question;
        return `${question}: ${answer}`;
      });

      const prompt = `Based on the following career quiz answers, please provide a detailed career analysis and recommendations:
      ${questionAnswerPairs.join('\n')}
      Please include: 1. Suggested career paths 2. Key strengths 3. Areas for development 4. Work environment preferences`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Error generating career report:', error);
      return 'Error generating career report. Please try again later.';
    }
  };

  const handleQuizSubmit = async (answers: { [key: number]: string }, quizType: 'basic' | 'detailed') => {
    const report = await generateCareerReport(answers, quizType);
    return report;
  };

  return (
    <div className="App">
      <Header setPage={setPage} />
      {!apiKey && <APIKeyForm onSubmit={handleApiKeySubmit} isKeySet={!!apiKey} />}
      {apiKey && page === 'home' && (
        <div className="home-container">
          <h1>Welcome to the Career Quiz</h1>
          <div className="quiz-selection">
            <Button variant="primary" onClick={() => setPage('detailed')}>
              Detailed Questions
            </Button>
            <p>This is a longer quiz that will provide a more thorough look into your future career and possible paths.</p>
            <Button variant="primary" onClick={() => setPage('basic')}>
              Basic Questions
            </Button>
            <p>This is a shorter quiz intended for quick insights into potential career options.</p>
          </div>
        </div>
      )}
      {apiKey && page === 'basic' && (
        <Questions 
          questions={basicQuestions} 
          quizType="basic"
          onSubmit={(answers) => handleQuizSubmit(answers, 'basic')}
        />
      )}
      {apiKey && page === 'detailed' && (
        <Questions 
          questions={detailedQuestions} 
          quizType="detailed"
          onSubmit={(answers) => handleQuizSubmit(answers, 'detailed')}
        />
      )}
    </div>
  );
};

export default App;