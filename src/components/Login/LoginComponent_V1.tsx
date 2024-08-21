import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent_V1_Style_V1.css'

interface LoginPageProps {
    authUrl: string;
    storageKey: string;
    cssClassName?: string;
    emailLabel?: string;
    passwordLabel?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    onNavigateAfterLogin?: string; // New prop for navigation
}

const LoginPage: React.FC<LoginPageProps> = ({
    authUrl,
    storageKey,
    cssClassName = '',
    emailLabel = 'Email',
    passwordLabel = 'Password',
    errorMessage = 'Invalid credentials',
    onSuccess,
    onNavigateAfterLogin // New prop for navigation
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false); // State for Remember Me

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // Perform any custom success action
                if (onSuccess) onSuccess();
                if (rememberMe) {
                    localStorage.setItem(storageKey, data.token); // Store token in localStorage
                } else {
                    sessionStorage.setItem(storageKey, data.token); // Store token in sessionStorage
                }

                // Navigate to the specified route after login
                if (onNavigateAfterLogin) {
                    navigate(onNavigateAfterLogin);
                }
            } else {
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className={cssClassName}>
            <h2 className='login-header'>Login</h2>
            <input className='login-input'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailLabel}
            />
            <input
                className='login-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={passwordLabel}
            />
            <div className='login-remember_div'>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label>Remember Me</label>
            </div>            
            <button className='login-button' onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginPage;
