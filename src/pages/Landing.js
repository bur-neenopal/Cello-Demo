// src/pages/Landing.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Landing = () => {
    useEffect(() => {
        // Look for both 'ucc' (direct Cello param) and 'ref' (your app's param)
        const params = new URLSearchParams(window.location.search);
        const referralCode = params.get('ucc') || params.get('ref');

        if (referralCode) {
            localStorage.setItem('referralCode', referralCode);
            console.log("Referral code saved to localStorage:", referralCode);
        }
    }, []);

    // Check if we have a referral code
    const hasReferral = localStorage.getItem('referralCode');

    return (
        <div>
            <Navbar />
            <div style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                    Book Your Perfect Workspace with TrackDesk
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
                    Find and reserve the ideal workspace for your needs.
                    Whether you need a quiet office, a meeting room, or a collaborative space,
                    we've got you covered.
                </p>

                {hasReferral && (
                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        color: '#2e7d32'
                    }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            You've been referred by a friend!
                        </p>
                        <p>
                            Sign up now to claim your special offer.
                        </p>
                    </div>
                )}

                <Link to="/signup">
                    <button style={{
                        backgroundColor: '#4a6bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 2rem',
                        fontSize: '1.1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        {hasReferral ? 'Claim Your Offer' : 'Get Started'}
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;