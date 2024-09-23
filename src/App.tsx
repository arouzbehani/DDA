import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Documents from './pages/Documents';
import Register from './pages/Register';
import Dashboard from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />            
            <Route
                path="/documents"
                element={
                    <PrivateRoute>
                        <Documents />
                    </PrivateRoute>
                }
            />                  
        </Routes>
    );
};

export default App;
