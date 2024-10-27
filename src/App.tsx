// src/App.tsx
import React from 'react';
import Register from './register';
import Login from './login';

const App: React.FC = () => {
  return (
    <div>
      <h1>Metroll v1</h1>
      <Register />
      <Login />
    </div>
  );
};

export default App;

