// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ margin: 0, color: '#4a6bff' }}>Cello demo</h1>
            </Link>
            <div>
                <Link to="/" style={{
                    marginRight: '1rem',
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: 'bold'
                }}>
                    Home
                </Link>
                <Link to="/signup" style={{
                    textDecoration: 'none',
                    backgroundColor: '#4a6bff',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}>
                    Sign Up
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;