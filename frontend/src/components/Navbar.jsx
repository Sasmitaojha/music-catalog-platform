import React from 'react';
import { Disc3, Search, Library, BarChart3, Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'search', label: 'Browse', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => setActiveTab('search')}>
        <div className="sidebar-logo">
          <Disc3 className="sidebar-logo-icon" />
        </div>
        <div>
          <h1>SoundPulse</h1>
          <p>Music Experience</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
            >
              <Icon className="sidebar-item-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-promo glass-panel">
        <p className="promo-title">Upgrade to Premium</p>
        <p className="promo-text">Remove ads and access custom playlists made just for you.</p>
        <button className="btn-secondary promo-button">Go Premium</button>
      </div>
    </aside>
  );
}
