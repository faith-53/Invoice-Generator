import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { AlertProvider } from './context/alertContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AlertProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AlertProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);