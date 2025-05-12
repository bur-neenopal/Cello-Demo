
// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { signupUser } from '../services/api';
import { useEffect } from 'react';


const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        referralCode: '' // Add this line
    });

    useEffect(() => {
        // Get referral code from URL if present
        const params = new URLSearchParams(window.location.search);
        const referralCode = params.get('ref');

        if (referralCode) {
            // Store referral code in form data
            sessionStorage.setItem('referralCode', referralCode); // For Cello initialization later
            setFormData(prev => ({
                ...prev,
                referralCode
            }));

            console.log(`Signing up with referral code: ${referralCode}`);
        }
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await signupUser(formData); // This will now include referralCode
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/payment');
        } catch (error) {
            setError('Signup failed. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        margin: '0.5rem 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem'
    };

    return (
        <div>
            <Navbar />
            <div style={{
                maxWidth: '500px',
                margin: '2rem auto',
                padding: '2rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Your Account</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '0.8rem',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                            minLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            backgroundColor: '#4a6bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
