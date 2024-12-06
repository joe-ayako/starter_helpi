import React, { useState, useEffect } from 'react'; // Importing necessary hooks from React
import './App.css'; // Importing the CSS file for styling
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap'; // Importing components from react-bootstrap

// Defining the structure of a Question object
interface Question {
  question: string; // The question text
  answers: string[]; // An array of possible answers
}

// Defining the props for a component that will handle questions
interface QuestionsProps {
  questions: Question[]; // An array of Question objects
  quizType: 'basic' | 'detailed'; // The type of quiz, either 'basic' or 'detailed'
  onSubmit: (answers: { [key: number]: string }) => Promise<string>; // A function to handle form submission, returns a Promise with a string
}

// Defining the props for a component that will handle API key submission
interface APIKeyFormProps {
  onSubmit: (apiKey: string) => void; // A function to handle API key submission
  apiKey: string; // The API key as a string
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

// Define the detailed questions array
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

// Define the props for the APIKeyForm component
interface APIKeyFormProps {
  onSubmit: (apiKey: string) => void;
  apiKey: string;
}

// Component for handling API key input and submission
const APIKeyForm: React.FC<APIKeyFormProps> = ({ onSubmit, apiKey }) => {
  const [newApiKey, setNewApiKey] = useState<string>('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newApiKey);
    setNewApiKey('');
  };

  return (
    <div className="api-key-form mb-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>ChatGPT API Key {apiKey && '(Currently Set)'}</Form.Label>
          <Form.Control
            type="password"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            placeholder={apiKey ? "Enter new API key to update" : "Enter your API key"}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          {apiKey ? 'Update API Key' : 'Save API Key'}
        </Button>
      </Form>
      {apiKey && (
        <div className="text-success mt-2">
          ✓ API Key is set (submit new key above to update)
        </div>
      )}
    </div>
  );
};

// Define the props for the Questions component
interface QuestionsProps {
  questions: Question[];
  quizType: 'basic' | 'detailed';
  onSubmit: (answers: { [key: number]: string }) => Promise<string>;
}

const Questions: React.FC<QuestionsProps> = ({ questions, quizType, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [careerReport, setCareerReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add these new state variables for feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`${quizType}QuizAnswers`) || '{}');
    setAnswers(savedAnswers);
  }, [quizType]);

  const handlePrevious = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  
  // Replace your existing handleAnswerChange function with this updated version
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: value }));
    
    // Add answer confirmation feedback
    setFeedbackType('success');
    setFeedbackMessage('Answer recorded successfully!');
    setTimeout(() => setFeedbackMessage(''), 1500);
  };

  // Replace your existing handleSubmit function with this updated version
  const handleSubmit = async () => {
    setIsLoading(true);
    setShowSubmitModal(true);
    localStorage.setItem(`${quizType}QuizAnswers`, JSON.stringify(answers));
    
    try {
      const report = await onSubmit(answers);
      setCareerReport(report);
      setFeedbackType('success');
      setFeedbackMessage('Your responses have been processed successfully!');
    } catch (error) {
      setCareerReport("There was an error generating your career report. Please check your API key and try again.");
      setFeedbackType('error');
      setFeedbackMessage('Error processing responses. Please try again.');
    }
    setIsLoading(false);
  };

  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / questions.length) * 100);
  const allAnswered = answeredQuestions === questions.length;

  return (
    <div className="quiz-container">
      <div className="question-card">
        {feedbackMessage && (
          <div className={`feedback-message ${feedbackType}`}>
            {feedbackMessage}
          </div>
        )}
        <h2 className="question-text">{questions[currentQuestion].question}</h2>
        {/* Rest of your existing JSX remains the same */}
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
        <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Career Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoading ? (
              <div className="text-center">
                <p>Generating your career report...</p>
                <ProgressBar animated now={100} />
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-line' }}>
                {careerReport || 'Processing your answers...'}
              </div>
            )}
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

// Header component for the app
const Header: React.FC<{ setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ setPage }) => (
  <header className="app-header">
    <h1>Career Quizine</h1>
    <p>Your Ultimate Recipe for Career Success</p>
    <button onClick={() => setPage('home')} className="home-button">Home</button>
  </header>
);

// Main App component
const App: React.FC = () => {
  const [page, setPage] = useState<string>('home');
  const [apiKey, setApiKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load saved API key from localStorage when the component mounts
  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgptApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Handle API key submission
  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('chatgptApiKey', key);
    setApiKey(key);
    setErrorMessage('');
  };

  // Check if the API key is valid
  const checkApiKey = async (): Promise<boolean> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }]
        })
      });

      if (!response.ok) {
        throw new Error('Invalid API key');
      }

      return true;
    } catch (error) {
      setErrorMessage('Invalid API key. Please check your API key and try again.');
      return false;
    }
  };

  /**
   * Generates a career report based on the user's quiz answers.
   * 
   * @param {{ [key: number]: string }} answers - The user's answers to the quiz questions.
   * @param {'basic' | 'detailed'} quizType - The type of quiz ('basic' or 'detailed').
   * @returns {Promise<string>} A promise that resolves to the generated career report.
   * @throws {Error} Throws an error if the API key is invalid or the report generation fails.
   */
  const generateCareerReport = async (answers: { [key: number]: string }, quizType: 'basic' | 'detailed'): Promise<string> => {
    const isValidKey = await checkApiKey();
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate career report');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Handle quiz submission
  const handleQuizSubmit = async (answers: { [key: number]: string }, quizType: 'basic' | 'detailed'): Promise<string> => {
    try {
      const report = await generateCareerReport(answers, quizType);
      setErrorMessage('');
      return report;
    } catch (error) {
      setErrorMessage('Error generating career report. Please check your API key and try again.');
      throw error;
    }
  };

  return (
    <div className="App">
      <Header setPage={setPage} />
      {page === 'home' && (
        <div className="home-container">
          <APIKeyForm onSubmit={handleApiKeySubmit} apiKey={apiKey} />
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
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
      {page === 'basic' && (
        <Questions 
          questions={basicQuestions} 
          quizType="basic"
          onSubmit={(answers) => handleQuizSubmit(answers, 'basic')}
        />
      )}
      {page === 'detailed' && (
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