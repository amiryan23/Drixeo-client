import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MyContextProvider } from './context/Context';
import './i18n';
import telegramAnalytics from '@telegram-apps/analytics';

telegramAnalytics.init({
    token: process.env.REACT_APP_ANALYTICS_TOKEN, 
    appName: process.env.REACT_APP_APP_NAME, 
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <MyContextProvider>
    <App />
   </MyContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
