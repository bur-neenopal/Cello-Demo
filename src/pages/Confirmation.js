
// src/pages/Confirmation.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CelloButton from '../components/CelloButton';
import { initializeCello } from '../services/cello';

const Confirmation = () => {
    const navigate = useNavigate();
    const [celloInitialized, setCelloInitialized] = useState(false);

    useEffect(() => {
        const currentUserStr = localStorage.getItem('currentUser');

        if (!currentUserStr) {
            navigate('/signup');
            return;
        }

        const currentUser = JSON.parse(currentUserStr);

        // Initialize Cello
        const setupCello = async () => {
            try {
                const success = await initializeCello(currentUser.id, {
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email,
                    fullName: `${currentUser.firstName} ${currentUser.lastName}`
                });

                setCelloInitialized(success);
            } catch (error) {
                console.error("Failed to initialize Cello:", error);
            }
        };

        setupCello();
    }, [navigate]);

    // Get user's first name from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const firstName = currentUser.firstName || 'there';

    return (
        <div>
            <Navbar />
            <div style={{
                maxWidth: '600px',
                margin: '4rem auto',
                padding: '2rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                    ✅
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    Thank You for Your Booking!
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
                    Hey {firstName}, your workspace has been successfully reserved.
                    You'll receive a confirmation email shortly.
                </p>

                <div style={{
                    backgroundColor: '#e6f7ff',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ marginTop: 0 }}>Booking Details:</h3>
                    <p>Workspace: Premium Office #42</p>
                    <p>Date: Tomorrow, 9:00 AM - 5:00 PM</p>
                    <p>Confirmation Code: TRK-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>

                <Link to="/">
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
                        Return to Home
                    </button>
                </Link>
            </div>


            {celloInitialized && (
                <>
                    <CelloButton />
                </>
            )}

        </div>


    );
};

export default Confirmation;
