// src/LoginPage.tsx
import React from 'react';
import Login from '../components/Login';
import {useNavigate} from "react-router-dom";
import GoogleSignIn from "../components/GoogleSSO";
import { Button, Container, Stack } from '@mui/material';
// Nishil & Justin
const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Stack spacing={2} alignItems="center">
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Home
          </Button>
          
          <Login />
          <GoogleSignIn />
          
          <Button variant="outlined" color="secondary" onClick={() => navigate('/register')}>
            Go to Register
          </Button>
        </Stack>
      </Container>
    );
};

export default LoginPage;