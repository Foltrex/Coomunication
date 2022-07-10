import React from "react";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

import {Provider} from 'react-redux';
import store from './services/store';

axios.interceptors.request.use(
    request => {
        request.headers['Authorization'] = localStorage.getItem("jwt_token")
        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider store={store}><App /></Provider>);
