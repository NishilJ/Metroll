// src/Login.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

// Justin
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful');
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
export {};
