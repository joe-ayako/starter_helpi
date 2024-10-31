import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form } from 'react-bootstrap';
import Header from './Header';
import { Link, Route, Routes } from 'react-router-dom';
import BasicQuestions from './BasicQuestions';
import DetailedQuestions from './DetailedQuestions';

let keyData = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData);

if (prevKey !== null) {
  keyData = JSON.parse(prevKey);
}

function App() {
  const [key, setKey] = useState<string>(keyData);

  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload();
  }

  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }

  return (
    <div className="App">
      <Header />
      <div>
        <Link to="/detailed">
          <Button variant="primary">Detailed Questions</Button>
        </Link>
        <p>This is a longer quiz that will provide a more thorough look into your future career 
          and will give possible paths and options to pursue said careers.
        </p>
      </div>
      <div>
        <Link to="/basic">
          <Button variant="primary">Basic Questions</Button>
        </Link>
        <p>This is a shorter quiz that is intended for people who want a quick answer and are curious
          about potential career options.
        </p>
      </div>
      <Form>
        <Form.Label>API Key:</Form.Label>
        <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
        <br />
        <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
      </Form>

      {/* Routes for different assessments */}
      <Routes>
        <Route path="/detailed" element={<DetailedQuestions />} />
        <Route path="/basic" element={<BasicQuestions />} />
      </Routes>
    </div>
  );
}

export default App;
