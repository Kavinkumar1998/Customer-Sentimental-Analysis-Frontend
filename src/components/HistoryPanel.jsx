import React from 'react';
import { History, Trash2, ArrowUpRight, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

export default function HistoryPanel({ history, onSelectReview, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <History size={16} /> No review history recorded yet in this session.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={16} color="var(--accent-primary)" />
          Recent Session History ({history.length})
        </h3>
        <button
          onClick={onClearHistory}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
        >
          <Trash2 size={13} /> Clear History
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {history.map((item, idx) => {
          const badgeClass = 
            item.sentiment === 'positive' ? 'badge-positive' :
            item.sentiment === 'negative' ? 'badge-negative' : 'badge-neutral';

          return (
            <div
              key={idx}
              onClick={() => onSelectReview && onSelectReview(item.text)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                <span className={`badge ${badgeClass}`} style={{ flexShrink: 0, padding: '0.15rem 0.5rem', fontSize: '0.725rem' }}>
                  {item.sentiment === 'positive' && <ThumbsUp size={11} />}
                  {item.sentiment === 'negative' && <ThumbsDown size={11} />}
                  {item.sentiment === 'neutral' && <Minus size={11} />}
                  {item.sentiment}
                </span>
                <span style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '520px',
                }}>
                  {item.text}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {item.confidence && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {Math.round(item.confidence * 100)}%
                  </span>
                )}
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
