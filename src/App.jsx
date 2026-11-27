import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import SingleReview from './components/SingleReview';
import BatchReview from './components/BatchReview';
import HistoryPanel from './components/HistoryPanel';
import { 
  checkBackendHealth, 
  predictReview, 
  predictBatchReviews, 
  getStoredBaseUrl, 
  setStoredBaseUrl 
} from './api';
import { Sparkles, Layers, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch'
  const [backendUrl, setBackendUrl] = useState(getStoredBaseUrl());
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true, error: null });
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [errorToast, setErrorToast] = useState('');

  // Session stats & history stored in localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nlp_review_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('nlp_review_stats');
      return saved ? JSON.parse(saved) : { total: 0, positive: 0, neutral: 0, negative: 0, alerts: 0 };
    } catch {
      return { total: 0, positive: 0, neutral: 0, negative: 0, alerts: 0 };
    }
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('nlp_review_history', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('nlp_review_stats', JSON.stringify(stats));
  }, [stats]);

  // Health check
  const verifyHealth = useCallback(async (url = backendUrl) => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const res = await checkBackendHealth(url);
    if (res.ok) {
      setBackendStatus({ online: true, checking: false, error: null });
    } else {
      setBackendStatus({ online: false, checking: false, error: res.error });
    }
  }, [backendUrl]);

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(() => verifyHealth(), 30000); // periodically ping every 30s
    return () => clearInterval(interval);
  }, [verifyHealth]);

  const handleUpdateBackendUrl = (newUrl) => {
    setStoredBaseUrl(newUrl);
    setBackendUrl(newUrl);
    verifyHealth(newUrl);
  };

  // Analyze single review
  const handleAnalyzeSingle = async (text, callback) => {
    setLoading(true);
    setErrorToast('');
    try {
      const result = await predictReview(text, backendUrl);
      setLastResult(result);

      // Update statistics
      setStats((prev) => ({
        total: prev.total + 1,
        positive: prev.positive + (result.sentiment === 'positive' ? 1 : 0),
        neutral: prev.neutral + (result.sentiment === 'neutral' ? 1 : 0),
        negative: prev.negative + (result.sentiment === 'negative' ? 1 : 0),
        alerts: prev.alerts + (result.sentiment === 'negative' ? 1 : 0),
      }));

      // Append to history
      setHistory((prev) => [
        {
          text,
          sentiment: result.sentiment,
          confidence: result.confidence,
          cleaned_text: result.cleaned_text,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);

      if (callback) callback(result);
    } catch (err) {
      setErrorToast(err.message || 'Failed to predict sentiment. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Analyze batch of reviews
  const handleBatchAnalyze = async (reviews, callback) => {
    setLoading(true);
    setErrorToast('');
    try {
      const results = await predictBatchReviews(reviews, backendUrl);
      
      // Update statistics
      const posCount = results.filter((r) => r.sentiment === 'positive').length;
      const neuCount = results.filter((r) => r.sentiment === 'neutral').length;
      const negCount = results.filter((r) => r.sentiment === 'negative').length;

      setStats((prev) => ({
        total: prev.total + results.length,
        positive: prev.positive + posCount,
        neutral: prev.neutral + neuCount,
        negative: prev.negative + negCount,
        alerts: prev.alerts + negCount,
      }));

      // Append batch items to history
      const newItems = results.map((r) => ({
        text: r.text,
        sentiment: r.sentiment,
        confidence: r.confidence,
        cleaned_text: r.cleaned_text,
        timestamp: new Date().toISOString(),
      }));

      setHistory((prev) => [...newItems, ...prev]);

      if (callback) callback(results);
    } catch (err) {
      setErrorToast(err.message || 'Batch classification failed. Please verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setStats({ total: 0, positive: 0, neutral: 0, negative: 0, alerts: 0 });
    localStorage.removeItem('nlp_review_history');
    localStorage.removeItem('nlp_review_stats');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backendStatus={backendStatus}
        backendUrl={backendUrl}
        onUpdateBackendUrl={handleUpdateBackendUrl}
        onRefreshHealth={() => verifyHealth()}
      />

      <main className="container" style={{ flex: 1 }}>
        {/* Offline Warning Banner */}
        {!backendStatus.online && !backendStatus.checking && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertCircle size={20} color="#ef4444" />
              <div>
                <strong style={{ color: '#ef4444' }}>Backend is not responding at {backendUrl}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Start the FastAPI server: <code>cd Backend && uvicorn src.api.app:app --reload</code>
                </div>
              </div>
            </div>
            <button 
              onClick={() => verifyHealth()} 
              className="btn btn-secondary btn-sm"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Global Error Toast */}
        {errorToast && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fca5a5',
            fontSize: '0.85rem',
          }}>
            <span>{errorToast}</span>
            <button
              onClick={() => setErrorToast('')}
              style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Aggregate Stats */}
        <StatsOverview stats={stats} />

        {/* Mode Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          <button
            onClick={() => setActiveTab('single')}
            className={`btn ${activeTab === 'single' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sparkles size={16} /> Single Review Analyzer
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`btn ${activeTab === 'batch' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Layers size={16} /> Batch / CSV Classification
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'single' ? (
          <SingleReview
            onAnalyze={handleAnalyzeSingle}
            loading={loading}
            lastResult={lastResult}
          />
        ) : (
          <BatchReview
            onBatchAnalyze={handleBatchAnalyze}
            loading={loading}
          />
        )}

        {/* Session History */}
        <HistoryPanel
          history={history}
          onSelectReview={(text) => {
            setActiveTab('single');
            setLastResult(null);
          }}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginTop: '2rem',
      }}>
        Customer Review NLP &bull; Scikit-Learn TF-IDF + Logistic Regression &bull; FastAPI Backend
      </footer>
    </div>
  );
}
