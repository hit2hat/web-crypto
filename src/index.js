import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './containers/App';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
