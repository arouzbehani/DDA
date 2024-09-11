import LoginPage from '../components/Login/v1.0/LoginComponent_V1';

const App: React.FC = () => {
    const handleSuccess = () => {
        console.log('User successfully logged in!');
        // Additional actions after login can be added here
    };

    return (
        <div>
            <LoginPage
                authUrl="http://localhost:5270/api/user/login"
                storageKey="authToken"
                cssClassName="custom-login-page"
                emailLabel="Email Address"
                passwordLabel="Password"
                errorMessage="Please check your credentials"
                onSuccess={handleSuccess}
                onNavigateAfterLogin="/profile" // Redirect to dashboard after login
            />
        </div>
    );
};

export default App;
