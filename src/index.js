import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from 'routes';
import { AnimeCatalogProvider } from './context/AnimeCatalogContext';
import { AuthProvider } from './context/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><AuthProvider><AnimeCatalogProvider><AppRoutes /></AnimeCatalogProvider></AuthProvider></React.StrictMode>);
