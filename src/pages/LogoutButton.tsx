import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // or whatever key you used to store the token
        sessionStorage.removeItem('authToken'); // or whatever key you used to store the token
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
