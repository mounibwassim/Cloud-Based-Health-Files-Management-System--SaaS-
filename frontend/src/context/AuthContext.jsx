import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // SECURE MODE: Do not persist session. User must login every time.
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('/login', { username, password });

            // Note: We still save to local storage for the request headers to keep working (token),
            // but we don't restore it on page load (above).
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // Optional, but good for reference if needed

            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error("Login Error:", err);
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (username, password) => {
        try {
            const res = await api.post('/register', { username, password });
            return { success: true };
        } catch (err) {
            console.error('Signup Error:', err);
            const msg = err.response?.data?.error || 'Registration failed.';
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const deleteAccount = async () => {
        try {
            await api.delete('/users/me');
            logout();
            return { success: true };
        } catch (err) {
            console.error("Delete Account Error:", err);
            return { success: false, error: "Failed to delete account." };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, deleteAccount, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
