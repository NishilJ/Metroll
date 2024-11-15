// src/RegisterPage.tsx
import React from 'react';
import Register from '../components/Register';
import {useNavigate} from "react-router-dom";
import { Button, Container, Stack } from '@mui/material';
// Nishil & Justin
const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Button variant="contained" onClick={() => navigate('/')}>Home</Button>
          <Register />
          <Button variant="outlined" onClick={() => navigate('/login')}>Go to Login</Button>
        </Stack>
      </Container>
    );
  };

export default RegisterPage;

