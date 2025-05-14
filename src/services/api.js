// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL
});

// User signup function - update to include referral code
export const signupUser = async (userData) => {
    try {
        const response = await api.post('/api/users', userData);
        return response.data;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

// Get token for Cello
export const getCelloToken = async (userId) => {
    try {
        const response = await api.get(`/api/token?productUserId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Token fetch error:", error);
        throw error;
    }
};

// Get user data
export const getUser = async (userId) => {
    try {
        const response = await api.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("User fetch error:", error);
        throw error;
    }
};

// Process payment and handle referral
export const processPayment = async (paymentData) => {
    const url = `${API_URL}/api/payment`; // Explicitly construct URL
    console.log('Making payment request to:', url); // <-- ADD THIS

    try {
        const response = await axios.post(url, paymentData);
        return response.data;
    } catch (error) {
        console.error("Payment error - Full URL:", url, error);
        throw error;
    }
};