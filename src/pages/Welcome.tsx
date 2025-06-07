import React from 'react';
import { Link } from 'react-router-dom';
// Update the path below to the correct relative path based on your project structure
import Button from '../components/ui/Button';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to NeuroPlanner</h1>
      <p>Your productivity companion, built with neurodiversity in mind.</p>
      <Link to="/auth">
        <Button variant="primary">Get Started</Button>
      </Link>
    </div>
  );
};

export default Welcome;
