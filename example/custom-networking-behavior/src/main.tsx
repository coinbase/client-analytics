import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectComponents } from 'client-analytics';

const overrides = {
  createNetworkLayer: () => {
    return {
      sendEvents: (events) => {
        // here you can send the events to your backend
        // or any other service
        console.log('sendEvents', events);
      },
      sendMetrics: (metrics) => {
        // here you can send the metrics to your backend
        // or any other service
        console.log('sendMetrics', metrics);
      },
    };
  },
};

const customInit = injectComponents(overrides);
customInit({
  platform: 'web',
  projectName: 'analytics-example',
  eventPath: '/amp',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
