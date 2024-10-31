import React, { useState, useEffect } from 'react';
import Header from './Header'; // Import the Header component
import { Button, ProgressBar } from 'react-bootstrap';

const DetailedQuestions = () => {
  const totalQuestions = 10; // Adjust this to the actual total number of detailed questions
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);

  // Function to handle answering a question
  const handleQuestionComplete = () => {
    setCompletedQuestions(prev => Math.min(prev + 1, totalQuestions));
  };

  // Notify user when all questions are completed
  useEffect(() => {
    if (completedQuestions === totalQuestions) {
      alert("Congratulations! You've completed all questions in the detailed assessment.");
    }
  }, [completedQuestions]);

  return (
    <div>
      <Header />
      <h2>Detailed Career Assessment</h2>
      <p>Answer the following questions to receive a thorough analysis of potential career paths and options.</p>

      {/* Progress bar showing completion status */}
      <ProgressBar 
        now={(completedQuestions / totalQuestions) * 100} 
        label={`${completedQuestions}/${totalQuestions}`} 
      />

      {/* Button to simulate answering a question */}
      <Button onClick={handleQuestionComplete} variant="success" style={{ marginTop: '20px' }}>
        Answer Next Question
      </Button>
    </div>
  );
};

export default DetailedQuestions;
