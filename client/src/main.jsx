import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import DocsPage from './components/DocsPage.jsx';
import WireframePage from './components/WireframePage.jsx';
import ProcessMapPage from './components/ProcessMapPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/wireframe" element={<WireframePage />} />
        <Route path="/process" element={<ProcessMapPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
