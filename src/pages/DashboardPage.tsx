// Dashboard.tsx
import React from 'react';
import LogoutButton from './LogoutButton'; // Adjust the path based on your project structure

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {/* Other dashboard content here */}
            <LogoutButton /> {/* Add the logout button here */}
        </div>
    );
};

export default Dashboard;
