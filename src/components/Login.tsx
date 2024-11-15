// src/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

// Justin & Syed
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/'); // Redirect to homepage if authenticated
      }
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful');
      // The navigation will happen due to onAuthStateChanged listener
    } catch (error) {
      console.error("Error logging in:", error);
      alert((error as Error).message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Login</Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>
      </Stack>
    </Container>
  );
};

export default Login;
