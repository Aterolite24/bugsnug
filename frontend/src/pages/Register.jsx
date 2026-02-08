import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        handle: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { username, email, password, confirmPassword, handle } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await register(username, email, password, handle);
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
            setError(errorMessage);
        }
    };

    return (
        <section>
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <div className="input-box">
                        <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                        <input
                            type="text"
                            name="username"
                            required
                            value={username}
                            onChange={onChange}
                        />
                        <label>Username</label>
                    </div>

                    <div className="input-box">
                        <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                        <input
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={onChange}
                        />
                        <label>Email</label>
                    </div>

                    <div className="input-box">
                        <span className="icon"><ion-icon name="code-slash-outline"></ion-icon></span>
                        <input
                            type="text"
                            name="handle"
                            value={handle}
                            onChange={onChange}
                        />
                        <label>CF Handle (Optional)</label>
                    </div>

                    <div className="input-box">
                        <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                        <input
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={onChange}
                        />
                        <label>Password</label>
                    </div>

                    <div className="input-box">
                        <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={onChange}
                        />
                        <label>Confirm Password</label>
                    </div>

                    <div className="remember-forget">
                        <label><input type="checkbox" required /> I agree to terms</label>
                    </div>

                    <button type="submit">Register</button>

                    <div className="register-link">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;
