import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isLogin ? '/api/login' : '/api/register';
        
       
        const body = isLogin 
            ? { username: username.trim(), password: password.trim() } 
            : { username: username.trim(), password: password.trim(), email: email.trim() };


                    try {
            const response = await fetch(`http://localhost:3001${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (isLogin) {
                login(data.user, data.token);
                navigate('/webboard');
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true);
                // Clear fields for login
                setPassword('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-2 mt-1 border rounded" />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mt-1 border rounded" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mt-1 border rounded" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600 transition-all">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="w-full text-sm text-center text-orange-500 hover:underline">
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
