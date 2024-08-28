// AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
    token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';

    return (
        <AuthContext.Provider value={{ token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
