// src/Register.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

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
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Register</Typography>
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
        <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
          Register
        </Button>
      </Stack>
    </Container>
  );
};

export default Register;
export {};
