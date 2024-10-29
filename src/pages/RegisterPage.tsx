// src/RegisterPage.tsx
import React from 'react';
import Register from '../components/Register';
import {useNavigate} from "react-router-dom";

// Nishil & Justin
const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/')}>Home</button>
            <Register />
            <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
    );
};

export default RegisterPage;

