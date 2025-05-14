// src/pages/Payment.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CelloButton from '../components/CelloButton';
import { initializeCello } from '../services/cello';
import { processPayment } from '../services/api'; // Import the new payment function


const Payment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
            const referralCode = localStorage.getItem('referralCode');

            if (!referralCode) {
                console.log("No referral code found — skipping Cello init.");
                setLoading(false);
                return;
            }

            try {
                console.log("referralCode", referralCode);
                const success = await initializeCello(currentUser.id, {
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email,
                    fullName: `${currentUser.firstName} ${currentUser.lastName}`
                });

                setCelloInitialized(success);

            } catch (error) {
                console.error("Failed to initialize Cello:", error);
            } finally {
                setLoading(false);
            }
        };

        setupCello();
    }, [navigate]);

    const [paymentAmount, setPaymentAmount] = useState(50); // default to $50

    const handlePayment = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const uccData = await window.celloAttribution.get();
            const referralCode = uccData?.ucc;

            console.log("Processing payment with referral code:", referralCode);

            // Include referral code in payment data
            await processPayment({
                userId: currentUser.id,
                amount: paymentAmount,
                currency: 'USD',
                referralCode: referralCode // Explicitly include referral code
            });

            navigate('/confirmation');
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment processing error");
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

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>Loading payment page...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{
                maxWidth: '600px',
                margin: '2rem auto',
                padding: '2rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0rem' }}>Complete Your Payment</h2>

                {!celloInitialized && (
                    <div style={{
                        backgroundColor: '#fff3e0',
                        color: '#e65100',
                        padding: '0.8rem',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                    }}>
                    </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Payment Amount (USD)
                    </label>
                    <select
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        style={{ ...inputStyle, width: '100%' }}
                    >
                        <option value="50">$50 (PRO PLAN)</option>
                    </select>
                </div>

                <form>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Card Number
                        </label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Expiration Date
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                CVV
                            </label>
                            <input
                                type="text"
                                placeholder="123"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handlePayment}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            backgroundColor: '#4a6bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Complete Payment
                    </button>
                </form>
            </div>

            {celloInitialized && <CelloButton />}
        </div>
    );
};

export default Payment;
