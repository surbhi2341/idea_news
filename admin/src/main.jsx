import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import { store } from './redux/store.js';
import App from './App.jsx';
import './index.css';

// Set default backend API URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://idea-news-backend.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
