// src/Register.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';

// Justin
const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration Successful');
      navigate('/login');
    } catch (error) {
      console.error("Error registering:", error);
      alert((error as Error).message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
export {};
