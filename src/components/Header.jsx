import React, { useState } from 'react';
import { 
  Sparkles, 
  Server, 
  Settings2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ExternalLink 
} from 'lucide-react';

export default function Header({ 
  backendStatus, 
  backendUrl, 
  onUpdateBackendUrl, 
  onRefreshHealth 
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(backendUrl);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateBackendUrl(inputUrl);
    setIsSettingsOpen(false);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(10, 14, 23, 0.75)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0.875rem 1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
                Customer Review NLP
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}>
                FastAPI + ML
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              TF-IDF & Logistic Regression Sentiment Engine with Instant Alerts
            </p>
          </div>
        </div>

        {/* Server Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Click to configure backend connection"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span 
              className={`status-dot ${
                backendStatus.checking ? 'checking' : backendStatus.online ? 'online' : 'offline'
              }`} 
            />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {backendStatus.checking 
                ? 'Connecting...' 
                : backendStatus.online 
                  ? 'Backend Active' 
                  : 'Backend Offline'}
            </span>
            <Settings2 size={14} color="var(--text-muted)" />
          </div>

          <button 
            onClick={onRefreshHealth}
            className="btn btn-secondary btn-sm"
            title="Refresh backend status"
          >
            <RefreshCw size={14} className={backendStatus.checking ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Settings Modal / Dropdown */}
      {isSettingsOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '1.5rem',
          marginTop: '0.5rem',
          width: 360,
          background: '#111827',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.25rem',
          zIndex: 50,
        }} className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Backend API Settings</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FastAPI</span>
          </div>

          <form onSubmit={handleSave}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Backend URL:
            </label>
            <input 
              type="text" 
              className="text-input" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              style={{ marginBottom: '0.75rem' }}
            />

            <div style={{ 
              background: 'rgba(0, 0, 0, 0.3)', 
              padding: '0.65rem', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              lineHeight: 1.4
            }}>
              <strong>How to run backend:</strong><br />
              <code>cd Backend</code><br />
              <code>uvicorn src.api.app:app --reload</code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
              >
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
