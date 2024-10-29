import React from 'react';
import {defaultTheme, Provider} from "@adobe/react-spectrum";
import {useNavigate} from "react-router-dom";

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Provider theme={defaultTheme}>
            <div>
                <button onClick={() => navigate('/')}>Home</button>
                <h2>About Page</h2>
                <p>This is the about page</p>
            </div>
        </Provider>
    );
};

export default AboutPage;
export {};