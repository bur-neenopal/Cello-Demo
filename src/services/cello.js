import { getCelloToken } from './api';

// Initialize Cello with user information
export const initializeCello = async (userId, userDetails) => {
    // Check if userId and userDetails are provided
    if (!userId || !userDetails) {
        console.error("Missing userId or userDetails for Cello initialization");
        return false;
    }

    console.log("Initializing Cello with userId:", userId);
    console.log("User details:", userDetails);

    // Load Cello script dynamically if not already loaded
    if (!document.getElementById('cello-script')) {
        await loadCelloScript();
    }

    try {
        const success = await initializeCelloInstance(userId, userDetails);
        return success;
    } catch (error) {
        console.error("Error initializing Cello:", error);
        return false;
    }
};

// Helper function to load Cello script
const loadCelloScript = () => {
    return new Promise((resolve, reject) => {
        console.log("Loading Cello script...");
        const script = document.createElement('script');
        script.id = 'cello-script';
        script.src = 'https://assets.sandbox.cello.so/app/latest/cello.js';
        script.type = 'module';
        script.async = true;

        script.onload = () => {
            console.log("Cello script loaded successfully");
            resolve(true);
        };

        script.onerror = (error) => {
            console.error("Failed to load Cello script:", error);
            reject(error);
        };

        document.head.appendChild(script);
    });
};

// Helper function to initialize Cello instance
const initializeCelloInstance = async (userId, userDetails) => {
    try {
        // Initialize Cello global object
        window.cello = window.cello || { cmd: [] };

        // Get token from your backend
        console.log("Getting Cello token for userId:", userId);
        // const { token } = await getCelloToken(userId);
        const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0SWQiOiJzdGFnZS1hcHAubW9ra3VwLmFpIiwicHJvZHVjdFVzZXJJZCI6IjMifQ.mSxpWVUT5za2EUeUivCydyDvO97JeprVa1nswnC_nh5VoWFwWzT6imP28-KCf4rYvxDep_fwhP93-1wsetCTlw';
        console.log("Received token:", token);

        // Return a promise that resolves when Cello is initialized
        return new Promise((resolve) => {
            // Push Cello configuration to command queue
            window.cello.cmd.push(function (cello) {
                // Boot Cello with config
                cello.boot({
                    productId: 'stage-app.mokkup.ai', // Hardcoded for reliability
                    token: token,
                    language: "en",
                    productUserDetails: userDetails,
                    hideDefaultLauncher: true,
                    onOpen: () => console.log('Referral widget opened'),
                    onClose: () => console.log('Referral widget closed')
                }).then(() => {
                    console.log("Cello initialized successfully");
                    resolve(true);
                }).catch(error => {
                    console.error("Failed to boot Cello:", error);
                    resolve(false);
                });
            });
        });
    } catch (error) {
        console.error("Error initializing Cello instance:", error);
        return false;
    }
};

// Open Cello widget function
export const openCelloWidget = () => {
    console.log("Attempting to open Cello widget");

    if (!window.cello) {
        console.error("Cello is not initialized yet");
        alert("Rewards program is not available at the moment. Please try again later.");
        return;
    }

    console.log("Opening Cello widget via window.Cello");
    try {
        // First try the capitalized version as used in your working demo
        if (typeof window.Cello === 'function') {
            window.Cello("open");
            console.log("Opened widget using window.Cello()");
            return;
        }

        // If that doesn't work, try the command queue approach
        window.cello.cmd.push(function (cello) {
            console.log("Opening Cello widget via cmd queue");
            try {
                cello.open();
                console.log("Cello widget opened successfully");
            } catch (innerError) {
                console.error("Error in cmd queue opening Cello widget:", innerError);
                alert("There was an error opening the rewards program. Please try again.");
            }
        });
    } catch (error) {
        console.error("Error opening Cello widget:", error);
        alert("There was an error opening the rewards program. Please try again.");
    }
};

// Generate a referral link
export const generateReferralLink = (userId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${userId}`;
};