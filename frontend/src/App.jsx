import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AiInsightsPage from './pages/AiInsightsPage';
import AuthModal from './components/AuthModal';
import api from './services/api';

function MainApp() {
  const [activeTab, setActiveTab] = useState('search');
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchLibrary();
    } else {
      setSavedAlbums([]);
    }
  }, [isAuthenticated]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const response = await api.get('/library?size=100');
      if (response.data && response.data.content) {
        setSavedAlbums(response.data.content);
      }
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleSaveAlbum = async (albumData) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in or create an account to save albums', 'info');
      return;
    }
    try {
      const response = await api.post('/library', albumData);
      setSavedAlbums((prev) => [response.data, ...prev]);
      showToast(`Saved "${response.data.title}" to your library!`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to save album';
      showToast(errMsg, 'error');
    }
  };

  const handleUpdateAlbum = async (id, updateData) => {
    try {
      const response = await api.put(`/library/${id}`, updateData);
      setSavedAlbums((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      showToast('Library entry updated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update album', 'error');
    }
  };

  const handleDeleteAlbum = async (id) => {
    try {
      await api.delete(`/library/${id}`);
      setSavedAlbums((prev) => prev.filter((item) => item.id !== id));
      showToast('Album removed from library');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete album', 'error');
    }
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`toast-notification ${
            toastMessage.type === 'error'
              ? 'toast-error'
              : toastMessage.type === 'info'
              ? 'toast-info'
              : 'toast-success'
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="content-area">
        <div className="content-wrapper">
          <header className="topbar">
            <div>
              <p className="topbar-title">Welcome back to SoundPulse</p>
              <p className="topbar-subtitle">Browse songs, save favorites, and explore your music analytics.</p>
            </div>
            <div className="topbar-actions">
              <button onClick={() => setActiveTab('search')} className="btn-secondary topbar-button">
                Browse Songs
              </button>
              {isAuthenticated ? (
                <>
                  <span className="topbar-user">Signed in as {user?.username || 'Member'}</span>
                  <button onClick={logout} className="btn-secondary topbar-button">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary topbar-button">
                  Sign In / Register
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 pb-24">
            {activeTab === 'search' && (
              <SearchPage
                savedAlbums={savedAlbums}
                onAlbumSaved={handleSaveAlbum}
              />
            )}

            {activeTab === 'library' && (
              <LibraryPage
                albums={savedAlbums}
                loading={loadingLibrary}
                onUpdateAlbum={handleUpdateAlbum}
                onDeleteAlbum={handleDeleteAlbum}
                onGoToSearch={() => setActiveTab('search')}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage savedAlbums={savedAlbums} />
            )}

            {activeTab === 'ai-insights' && (
              <AiInsightsPage
                savedAlbums={savedAlbums}
                onGoToSearch={() => setActiveTab('search')}
              />
            )}
          </main>

          <footer className="footer-bar">
            <div>
              <p className="footer-label">SoundPulse • Spotify-inspired music experience</p>
              <p className="footer-note">Built with Spring Boot, React, and the iTunes public catalog.</p>
            </div>
          </footer>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
