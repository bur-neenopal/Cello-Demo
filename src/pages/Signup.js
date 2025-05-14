// src/pages/Signup.js
import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { signupUser } from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        referralCode: ''
    });

    useEffect(() => {
        const referralCode = localStorage.getItem('referralCode');
        if (referralCode) {
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log("Sending formData to signupUser:", formData);
            const user = await signupUser(formData);
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/payment');
        } catch (error) {
            console.error('Signup error:', error);
            setError('Signup failed. Please try again.');
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
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} style={inputStyle} required />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} style={inputStyle} required />
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={inputStyle} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={inputStyle} required minLength="6" />

                    {/* Display the referral code if it exists */}
                    {formData.referralCode && (
                        <div style={{
                            margin: '0.5rem 0',
                            padding: '0.5rem',
                            backgroundColor: '#e8f5e9',
                            borderRadius: '4px',
                            color: '#2e7d32'
                        }}>
                            Referral code applied: {formData.referralCode}
                        </div>
                    )}

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