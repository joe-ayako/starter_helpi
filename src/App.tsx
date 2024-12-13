import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Form, ProgressBar, Modal } from 'react-bootstrap';
import FoodCatchGame from './Components/FoodCatchGame';

interface Question {
  question: string;
  answers: string[];
}

interface APIKeyFormProps {
  onSubmit: (apiKey: string) => void;
  apiKey: string;
}

interface QuestionsProps {
  questions: Question[];
  quizType: 'basic' | 'detailed';
  onSubmit: (answers: { [key: number]: string }) => Promise<string>;
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

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Person 1',
      role: 'Founder & Career Strategist',
      bio: 'With a passion for helping individuals discover their true potential, Person 1 brings years of career counseling experience to Career Quizine. Their innovative approach combines psychological insights with practical career guidance.',
      imagePlaceholder: '👩‍💼' // Replace with actual image or path later
    },
    {
      name: 'Person 2', 
      role: 'UX Design & Research Lead',
      bio: 'Person 2 is dedicated to creating intuitive, engaging user experiences. Their background in design psychology ensures that Career Quizine provides not just insights, but an enjoyable journey of self-discovery.',
      imagePlaceholder: '👨‍💻'
    },
    {
      name: 'Person 3',
      role: 'Technology & AI Specialist',
      bio: 'A tech innovator with a deep understanding of AI and machine learning, Person 3 powers the intelligent recommendation engine behind Career Quizine, turning complex data into actionable career insights.',
      imagePlaceholder: '🧑‍💻'
    }
  ];

  return (
    <div className="about-page">
      <div className="about-intro">
        <h2>About Career Quizine</h2>
        <p>
          Career Quizine is more than just a career assessment tool—it's a recipe for professional success. 
          We believe that finding the right career path should be an enjoyable, insightful journey. 
          By blending cutting-edge AI technology with deep psychological insights, 
          we help individuals uncover their unique professional potential.
        </p>
      </div>
      
      <div className="team-section">
        <h3>Meet Our Team</h3>
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image">
                <span className="image-placeholder">{member.imagePlaceholder}</span>
              </div>
              <div className="member-details">
                <h4>{member.name}</h4>
                <h5>{member.role}</h5>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const APIKeyForm: React.FC<APIKeyFormProps> = ({ onSubmit, apiKey }) => {
  const [newApiKey, setNewApiKey] = useState<string>('');

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

const Questions: React.FC<QuestionsProps> = ({ questions, quizType, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [careerReport, setCareerReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`${quizType}QuizAnswers`) || '{}');
    setAnswers(savedAnswers);
  }, [quizType]);

  const handlePrevious = () => setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestion]: value }));
    
    setFeedbackType('success');
    setFeedbackMessage('Answer recorded successfully!');
    setTimeout(() => setFeedbackMessage(''), 1100);
  };

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
      setCareerReport("Generating your career report, please wait...");
      setFeedbackType('error');
      setFeedbackMessage('Error processing responses. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="quiz-container">
      <div className="question-card">
        {feedbackMessage && (
          <div className={`feedback-message ${feedbackType}`}>
            {feedbackMessage}
          </div>
        )}
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
          <Button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0} 
            variant="outline-primary"
          >
            Previous
          </Button>
          <div className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <Button 
            onClick={handleNext} 
            disabled={currentQuestion === questions.length - 1} 
            variant="outline-primary"
          >
            Next
          </Button>
        </div>
        <ProgressBar 
          now={((currentQuestion + 1) / questions.length) * 100} 
          label={`${Math.round(((currentQuestion + 1) / questions.length) * 100)}%`} 
        />
        {currentQuestion === questions.length - 1 && (
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

const Header: React.FC<{ setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ setPage }) => (
  <header className="app-header">
    <h1>Career Quizine</h1>
    <p>Your Ultimate Recipe for Career Success</p>
    <div className="header-nav">
      <button onClick={() => setPage('home')} className="home-button">Home</button>
      <button onClick={() => setPage('about')} className="about-button">About</button>
    </div>
  </header>
);

const App: React.FC = () => {
  const [page, setPage] = useState<string>('game');
  const [apiKey, setApiKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgptApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleGameComplete = () => {
    setPage('home');
  };

  const startGame = () => {
    setShowWelcome(false);
  };

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('chatgptApiKey', key);
    setApiKey(key);
    setErrorMessage('');
  };

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

      return response.ok;
    } catch (error) {
      setErrorMessage('Invalid API key. Please check your API key and try again.');
      return false;
    }
  };

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

  if (page === 'game') {
    return showWelcome ? (
      <div className="welcome-screen">
        <h1>Welcome to Career Quizine</h1>
        <p>Before we help you find your perfect career path, let's have some fun!</p>
        <p>Catch as many food items as you can to unlock your career assessment.</p>
        <p>Use the left and right arrow keys to move the basket.</p>
        <Button variant="primary" size="lg" onClick={startGame}>
          Start Game
        </Button>
      </div>
    ) : (
      <FoodCatchGame onGameComplete={handleGameComplete} />
    );
  }

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
              Detailed Career Assessment
            </Button>
            <p>Take a comprehensive quiz for thorough career path insights.</p>
            <Button variant="primary" onClick={() => setPage('basic')}>
              Quick Career Assessment
            </Button>
            <p>Get quick insights into potential career options.</p>
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
      {page === 'about' && <AboutPage />}
    </div>
  );
};

export default App;