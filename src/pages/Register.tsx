import RegisterPage from '../components/registration/v1.0/registration_component_v1'

const App: React.FC = () => {
    const handleSuccess = () => {
        console.log('User successfully logged in!');
        // Additional actions after login can be added here
    };

    return (
        <div>
            <RegisterPage
                registerUrl="http://localhost:5270/api/user"
                onSuccess={(token) => console.log('Registration successful:', token)}
                onFailure={(error) => console.log('Registration failed:', error)}
                redirectTo="/dashboard"
                        />
        </div>
    );
};

export default App;
