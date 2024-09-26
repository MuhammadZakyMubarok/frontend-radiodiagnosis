// src/utils/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';
import authenticateService from '../api/satu-sehat/autentication.service';
import {satuSehatAuthURL, satuSehatBaseURL} from "../routes/Config";

// const client_id = process.env.REACT_APP_CLIENT_ID;
// const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const client_id = 'uKvQMdoWlOyF4irX5Svvm6gU9NKoU3er29JsARLoJXZYgARO'
const client_secret = '2KNWAXaRj4t9zAt1RFUR4zUpphLjlpZS5ZmAzwihj336bJca2ydsDqIosAWjXa9f'

const WITHOUT_CREDENTIAL_ROUTES = []

// To get Token
export const axiosSatuSehatAuth = axios.create({
    baseURL: satuSehatAuthURL,
    timeout: 5000
})

// Custom authRequestInterceptor function
function authRequestInterceptor(config) {
    if (WITHOUT_CREDENTIAL_ROUTES.includes(String(config.url))) {
        console.log('No credentials required for:', config.url);
        return config;
    }

    let token = Cookies.get('satu_sehat_token');

    if (!token) {
        console.log('Token not found in cookies, generating new token...');
        const authService = authenticateService();
        return authService.generateToken({
            client_id: client_id,
            client_secret: client_secret
        }).then(response => {
            token = response.data.data;

            // Store the new token in cookies
            Cookies.set('satu_sehat_token', token,{ expires: 1 / 24 });

            // Attach the new token to the Authorization header
            config.headers.authorization = `Bearer ${token}`;
            return config;
        });
    }

    // If token exists, attach it to the Authorization header
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }

    config.headers.Accept = 'application/json';
    return config;
}

// Base URL
export const axiosSatuSehat = axios.create({
    baseURL: satuSehatBaseURL,
    timeout: 5000,
})

// Add request interceptor to axiosSatuSehat
axiosSatuSehat.interceptors.request.use(
    authRequestInterceptor,
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);
