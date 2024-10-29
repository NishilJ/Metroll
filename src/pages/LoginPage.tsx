// src/LoginPage.tsx
import React from 'react';
import Login from '../components/Login';
import {useNavigate} from "react-router-dom";
import GoogleSignIn from "../components/GoogleSSO";

// Nishil & Justin
const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/')}>Home</button>
            <Login />
            <GoogleSignIn />
            <button onClick={() => navigate('/register')}>Go to Register</button>
        </div>
    );
};

export default LoginPage;