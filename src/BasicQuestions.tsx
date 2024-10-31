import React, { useState, useEffect } from 'react';
import Header from './Header'; // Import the Header component
import { Button, ProgressBar } from 'react-bootstrap';

const BasicQuestions = () => {
  const totalQuestions = 5; // Adjust to the actual total number of questions
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);

  // Function to handle answering a question
  const handleQuestionComplete = () => {
    setCompletedQuestions(prev => Math.min(prev + 1, totalQuestions));
  };

  // Notify user when all questions are completed
  useEffect(() => {
    if (completedQuestions === totalQuestions) {
      alert("Great job! You've completed all questions in the basic assessment.");
    }
  }, [completedQuestions]);

  return (
    <div>
      <Header />
      <h2>Basic Career Assessment</h2>
      <p>Answer the following questions to receive a quick look at potential career options.</p>

      {/* Progress bar showing completion status */}
      <ProgressBar 
        now={(completedQuestions / totalQuestions) * 100} 
        label={`${completedQuestions}/${totalQuestions}`} 
      />

      {/* Button to simulate answering a question */}
      <Button onClick={handleQuestionComplete} variant="primary" style={{ marginTop: '20px' }}>
        Answer Next Question
      </Button>
    </div>
  );
};

export default BasicQuestions;
