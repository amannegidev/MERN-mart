import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/auth';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/cart';
import { GoogleOAuthProvider } from '@react-oauth/google';


// import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <GoogleOAuthProvider clientId="358212969549-pl00kjhohms0c1nie16mtckkkh6kasaj.apps.googleusercontent.com">
  <AuthProvider>
   <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
   </CartProvider>
  </AuthProvider>
  </GoogleOAuthProvider>

);
