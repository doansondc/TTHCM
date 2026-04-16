import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PresentationView from './PresentationView';
import MobileVote from './routes/MobileVote';
import AdminDashboard from './routes/AdminDashboard';
import LockScreen from './routes/LockScreen';

function ProtectedPresentation() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('presenter_auth') === '1'
  );
  const handleUnlock = () => {
    sessionStorage.setItem('presenter_auth', '1');
    setUnlocked(true);
  };
  if (!unlocked) return <LockScreen onUnlock={handleUnlock} />;
  return <PresentationView />;
}
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/"      element={<ProtectedPresentation />} />
          <Route path="/vote"  element={<MobileVote />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
