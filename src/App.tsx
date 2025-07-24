import React, { useState } from 'react';
import { FacebookLogin } from './components/FacebookLogin';
import { PageSelector } from './components/PageSelector';
import { PageDashboard } from './components/PageDashboard';
import { FacebookPage, FacebookUser } from './types/facebook';
import { facebookSDK } from './services/facebookSDK';

type AppState = 'login' | 'pageSelection' | 'dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (userData: FacebookUser, token: string) => {
    setUser(userData);
    setAccessToken(token);
    setLoading(true);

    try {
      // Fetch user's pages
      const userPages = await facebookSDK.getUserPages(token);
      setPages(userPages);
      setCurrentState('pageSelection');
    } catch (error) {
      console.error('Failed to fetch pages:', error);
      // Still proceed to page selection even if no pages found
      setPages([]);
      setCurrentState('pageSelection');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (page: FacebookPage) => {
    setSelectedPage(page);
    setCurrentState('dashboard');
  };

  const handleBack = () => {
    if (currentState === 'dashboard') {
      setCurrentState('pageSelection');
      setSelectedPage(null);
    } else if (currentState === 'pageSelection') {
      setCurrentState('login');
      setUser(null);
      setAccessToken('');
      setPages([]);
    }
  };

  return (
    <div className="min-h-screen">
      {currentState === 'login' && (
        <FacebookLogin onLogin={handleLogin} loading={loading} />
      )}
      
      {currentState === 'pageSelection' && (
        <PageSelector 
          pages={pages}
          onSelectPage={handlePageSelect}
          onBack={handleBack}
          loading={loading}
        />
      )}
      
      {currentState === 'dashboard' && selectedPage && (
        <PageDashboard 
          page={selectedPage}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;