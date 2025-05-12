
// src/pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


const Landing = () => {
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
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
