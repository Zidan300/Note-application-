/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../contex/authContext.jsx';
import App from './App.jsx';
import './index.css';
function Root() { const [, refresh] = useState(0); useEffect(() => { const update = () => refresh((n) => n + 1); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []); return <AuthProvider><App /></AuthProvider>; }
createRoot(document.getElementById('root')).render(<StrictMode><Root /></StrictMode>);
