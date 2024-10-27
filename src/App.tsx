
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/registerpage';
import LoginPage from './pages/loginpage';
import GoogleSignInPage from './pages/googlepage';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={() => navigate('/register')}>Go to Register</button>
      <button onClick={() => navigate('/login')}>Go to Login</button>
      <button onClick={() => navigate('/google-signin')}>Go to Google Sign-In</button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/google-signin" element={<GoogleSignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;
