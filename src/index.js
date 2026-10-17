import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from 'routes';

import { Provider } from 'react-redux';
import store from './controller/store';
import { AnimeCatalogProvider } from './context/AnimeCatalogContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
/*
root.render(
      
      <React.StrictMode>
            <Provider store={store}>
                  <AppRoutes />
            </Provider>
      </React.StrictMode>
      */
 root.render(
            <React.StrictMode>
            <AnimeCatalogProvider>
            <AppRoutes />
            </AnimeCatalogProvider>
            </React.StrictMode>
);