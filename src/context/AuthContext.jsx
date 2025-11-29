import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [credentials, setCredentials] = useState(() => {
        // Load credentials from localStorage or use defaults
        const stored = localStorage.getItem('appCredentials');
        return stored ? JSON.parse(stored) : { username: 'Nestor', password: '1005' };
    });

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username, password) => {
        // Read from localStorage to get the latest credentials
        const storedCreds = localStorage.getItem('appCredentials');
        const currentCredentials = storedCreds ? JSON.parse(storedCreds) : { username: 'Nestor', password: '1005' };

        if (username === currentCredentials.username && password === currentCredentials.password) {
            const userData = { username };
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateCredentials = (newUsername, newPassword) => {
        const newCredentials = {
            username: newUsername || credentials.username,
            password: newPassword || credentials.password,
        };
        setCredentials(newCredentials);
        localStorage.setItem('appCredentials', JSON.stringify(newCredentials));

        // Update current user if username changed
        if (newUsername && user) {
            const updatedUser = { username: newUsername };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        credentials,
        login,
        logout,
        updateCredentials,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
