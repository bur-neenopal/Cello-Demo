require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // For parsing JSON request bodies

// Existing token endpoint
app.get('/api/token', (req, res) => {
    const { productUserId } = req.query;
    console.log("Token requested for user:", productUserId);

    if (!productUserId) {
        console.error("Missing productUserId in request");
        return res.status(400).json({ error: 'Missing user ID' });
    }

    const payload = {
        productId: process.env.PRODUCT_ID,  // Make sure this matches your Cello product ID
        productUserId: productUserId,     // User ID from the request
        iat: Math.floor(Date.now() / 1000)  // Current timestamp in seconds
    };

    console.log("Creating token with payload:", payload);

    try {
        const token = jwt.sign(payload, process.env.PRODUCT_SECRET, {
            algorithm: 'HS512'  // Must be HS512 exactly
        });
        console.log("Token generated successfully");
        res.json({ token });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: 'Token generation failed' });
    }
});

// New endpoint to fetch user details (mock)
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

app.get('/signup', (req, res) => {
    const { referralCode } = req.query;

    // Store the referral code in a cookie or session
    if (referralCode) {
        // In a real implementation, you would store this in a session or cookie
        console.log(`Referral code received: ${referralCode}`);
    }

    // In a real implementation, you would redirect to the signup page
    // For now, just send a response
    res.json({ message: 'Referral code received', referralCode });
});
// Mock database for users
const users = [];

// User signup endpoint
app.post('/api/users', (req, res) => {
    try {
        const { firstName, lastName, email, password, referralCode } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newUser = {
            id,
            firstName,
            lastName,
            email,
            password,
            referralCode: referralCode || null, // track if referral code was used
        };

        users.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add this helper function to server.js
const getEmailFromUserId = (userId) => {
    // Find user in your mock database
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'no-email@example.com';
};


app.post('/api/payment', async (req, res) => {
    const { userId, amount } = req.body;

    try {
        // 1. Find the user in your mock database
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Track payment in your database (mock implementation)
        console.log(`Payment of $${amount} recorded for user ${userId} (${user.email})`);

        // 3. Only notify Cello if user was referred
        if (user.referralCode) {
            const conversionResponse = await fetch('https://api.sandbox.cello.so/v1/conversions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PRODUCT_SECRET}`
                },
                body: JSON.stringify({
                    productUserId: userId,
                    amount: amount * 100, // Convert dollars to cents
                    currency: 'USD',
                    email: user.email,
                    metadata: {
                        product: "Workspace Booking",
                        booking_id: `booking-${Date.now()}`
                    }
                })
            });

            if (!conversionResponse.ok) {
                const error = await conversionResponse.json();
                console.error("Cello API error:", error);
                return res.status(500).json({ error: "Cello conversion failed" });
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ error: "Payment processing failed" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));