import React, { useState } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  ThumbsUp, 
  Minus, 
  ThumbsDown, 
  Bell, 
  Binary, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_REVIEWS = [
  {
    type: 'positive',
    label: 'Positive Sample',
    text: 'The product quality exceeded all my expectations! Super fast shipping, beautiful packaging, and works like a dream. Highly recommended!'
  },
  {
    type: 'negative',
    label: 'Negative Sample',
    text: 'Completely useless! Broke within 2 days of usage and customer service was rude and refused to refund my money. Total waste of time and cash.'
  },
  {
    type: 'neutral',
    label: 'Neutral Sample',
    text: 'The item arrived on time as scheduled. The size is standard and it performs the basic expected functionality. Nothing particularly special.'
  },
  {
    type: 'mixed',
    label: 'Subtle / Mixed',
    text: 'I really wanted to enjoy this gadget, but the battery drains far too quickly and it tends to overheat after 20 minutes.'
  }
];

export default function SingleReview({ onAnalyze, loading, lastResult }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || loading) return;

    onAnalyze(text.trim(), (result) => {
      // Trigger confetti on confident positive result
      if (result?.sentiment === 'positive' && (result?.confidence || 0) >= 0.6) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCopyCleaned = () => {
    if (lastResult?.cleaned_text) {
      navigator.clipboard.writeText(lastResult.cleaned_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
      {/* Left Input Column */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            Analyze Single Review
          </h2>
          {text && (
            <button
              onClick={() => setText('')}
              className="btn btn-secondary btn-sm"
              title="Clear input text"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>

        {/* Quick Sample Chips */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Lightbulb size={12} /> Click to try a sample:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {SAMPLE_REVIEWS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(sample.text)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            className="textarea-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste a customer review here (e.g. 'Loved the speedy delivery and supreme build quality!')..."
            rows={6}
            style={{ flex: 1, minHeight: '160px' }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            <span>
              {wordCount} words &bull; {charCount} chars
            </span>
            <span style={{ fontStyle: 'italic' }}>
              Press Ctrl + Enter to analyze
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {loading ? (
              <>
                <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span>Running NLP Inference...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Analyze Sentiment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Result Column */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Binary size={18} color="var(--accent-primary)" />
          Prediction & NLP Insights
        </h2>

        {!lastResult ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            border: '2px dashed rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
          }}>
            <Sparkles size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Awaiting Review Input
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', maxWidth: 280 }}>
              Type a review or select one of the sample presets to test the sentiment model.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Primary Sentiment Hero Card */}
            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 
                lastResult.sentiment === 'positive' 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
                  : lastResult.sentiment === 'negative'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
              border: `1px solid ${
                lastResult.sentiment === 'positive'
                  ? 'var(--sentiment-pos-border)'
                  : lastResult.sentiment === 'negative'
                    ? 'var(--sentiment-neg-border)'
                    : 'var(--sentiment-neu-border)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 
                    lastResult.sentiment === 'positive' 
                      ? 'rgba(16, 185, 129, 0.2)'
                      : lastResult.sentiment === 'negative'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                }}>
                  {lastResult.sentiment === 'positive' && <ThumbsUp size={28} color="var(--sentiment-pos)" />}
                  {lastResult.sentiment === 'negative' && <ThumbsDown size={28} color="var(--sentiment-neg)" />}
                  {lastResult.sentiment === 'neutral' && <Minus size={28} color="var(--sentiment-neu)" />}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Predicted Sentiment
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: 
                      lastResult.sentiment === 'positive' 
                        ? 'var(--sentiment-pos)'
                        : lastResult.sentiment === 'negative'
                          ? 'var(--sentiment-neg)'
                          : 'var(--sentiment-neu)',
                  }}>
                    {lastResult.sentiment}
                  </div>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Confidence
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {Math.round((lastResult.confidence || 0) * 100)}%
                </div>
              </div>
            </div>

            {/* Telegram Alert Notification Status (for negative reviews) */}
            {lastResult.sentiment === 'negative' && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <Bell size={20} color="#f87171" />
                <div style={{ fontSize: '0.825rem', lineHeight: 1.4 }}>
                  <strong style={{ color: '#f87171' }}>Business Alert Triggered:</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Negative review captured! Pushed instant notification to the store manager via Telegram.
                    {lastResult.alert_sent && <span style={{ color: '#34d399', marginLeft: 6 }}>✓ Telegram ping sent</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Probability Breakdown Bars */}
            {lastResult.probabilities && (
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  Model Class Probabilities (TF-IDF + Logistic Regression):
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['positive', 'neutral', 'negative'].map((cls) => {
                    const prob = lastResult.probabilities[cls] || 0;
                    const pct = Math.round(prob * 100);
                    const color = 
                      cls === 'positive' ? 'var(--sentiment-pos)' :
                      cls === 'negative' ? 'var(--sentiment-neg)' : 'var(--sentiment-neu)';

                    return (
                      <div key={cls}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                          <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {cls}
                          </span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                            {pct}% ({prob.toFixed(4)})
                          </span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${pct}%`, 
                              background: color, 
                              borderRadius: 3, 
                              transition: 'width 0.4s ease' 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NLP Cleaned Tokens Viewer */}
            {lastResult.cleaned_text && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    spaCy Lemmatized & Cleaned Tokens
                  </span>
                  <button 
                    onClick={handleCopyCleaned}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    title="Copy cleaned tokens"
                  >
                    {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: '#93c5fd',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}>
                  {lastResult.cleaned_text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Stopwords stripped, URLs & punctuation removed, lemmas generated while preserving sentiment negations (e.g. not, never, no).
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
