import React, { useState } from 'react';
import './registration_component_style_v1.css'

interface RegistrationFormProps {
    registerUrl: string;
    onSuccess?: (token: string) => void;
    onFailure?: (error: string) => void;
    onRegister?: () => void;
    redirectTo?: string;
    customCssClass?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
    registerUrl,
    onSuccess,
    onFailure,
    onRegister,
    redirectTo,
    customCssClass = ''
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleRegistration = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            if (onRegister) onRegister();

            const response = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                if (onSuccess) onSuccess(data.token);

                if (redirectTo) {
                    window.location.href = redirectTo;
                }
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.message || 'Registration failed.';
                setError(errorMessage);
                if (onFailure) onFailure(errorMessage);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMessage = 'Something went wrong. Please try again later.';
            setError(errorMessage);
            if (onFailure) onFailure(errorMessage);
        }
    };

    return (
        <div className={`custom-registration-form ${customCssClass}`}>
            <h2>Register</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
            />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleRegistration}>Register</button>
        </div>
    );
};

export default RegistrationForm;
