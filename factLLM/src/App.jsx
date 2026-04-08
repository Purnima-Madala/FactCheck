import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import ComparatorPage from './pages/ComparatorPage';
import './App.css';

const App = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track page views (optional analytics)
  useEffect(() => {
    console.log(`Page viewed: ${location.pathname}`);
    // You can add your analytics here
  }, [location]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/comparator" element={<ComparatorPage />} />
        {/* Add more routes as needed */}
      </Routes>
      
      {/* Floating Cursor Effect (Optional) */}
      <div className="cursor-glow"></div>
    </div>
  );
};

export default App;