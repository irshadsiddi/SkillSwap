import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Navbar from './components/Layout/Navbar';
import SkillBrowser from './components/Skills/SkillBrowser';
import UserProfile from './components/Profile/UserProfile';
import SwapRequests from './components/Requests/SwapRequests';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('browse');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!user) {
    return <LoginForm onToggleMode={() => setIsSignUp(!isSignUp)} isSignUp={isSignUp} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'browse':
        return <SkillBrowser onNavigate={setCurrentPage} />;
      case 'profile':
        return <UserProfile />;
      case 'requests':
        return <SwapRequests />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <SkillBrowser onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;