// src/components/CelloButton.js
import React, { useState } from 'react';
import { openCelloWidget } from '../services/cello';

const CelloButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState('Earn Rewards');

    const handleClick = () => {
        setIsLoading(true);
        setButtonText('Opening...');

        try {
            openCelloWidget();

            // Reset button state after a short delay
            setTimeout(() => {
                setIsLoading(false);
                setButtonText('Earn Rewards');
            }, 1000);
        } catch (error) {
            console.error("Error opening Cello widget:", error);
            setButtonText('Error');
            setTimeout(() => {
                setIsLoading(false);
                setButtonText('Earn Rewards');
            }, 2000);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                padding: '12px 24px',
                background: isLoading ? '#999' : '#4a6bff',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(74, 107, 255, 0.3)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
            }}
        >
            <span role="img" aria-label="gift">#</span> {buttonText}
        </button>
    );
};

export default CelloButton;