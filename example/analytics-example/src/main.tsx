import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { initAnalytics, initPageViewAnalytics, history } from './analytics';

initAnalytics();

initPageViewAnalytics(history);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
