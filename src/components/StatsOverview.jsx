import React from 'react';
import { ThumbsUp, Minus, ThumbsDown, Bell, BarChart2 } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const { total, positive, neutral, negative, alerts } = stats;

  const posPct = total > 0 ? Math.round((positive / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neutral / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negative / total) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    }}>
      {/* Total Card */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Analyzed
          </span>
          <div style={{ color: 'var(--accent-primary)' }}>
            <BarChart2 size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {total}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Session reviews processed
        </div>
      </div>

      {/* Positive Card */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--sentiment-pos)', fontWeight: 500 }}>
            Positive Sentiment
          </span>
          <ThumbsUp size={18} color="var(--sentiment-pos)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--sentiment-pos)' }}>
            {positive}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({posPct}%)
          </span>
        </div>
        {/* Tiny Bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: '0.5rem' }}>
          <div style={{ height: '100%', width: `${posPct}%`, background: 'var(--sentiment-pos)', borderRadius: 2 }} />
        </div>
      </div>

      {/* Neutral Card */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--sentiment-neu)', fontWeight: 500 }}>
            Neutral Sentiment
          </span>
          <Minus size={18} color="var(--sentiment-neu)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--sentiment-neu)' }}>
            {neutral}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({neuPct}%)
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: '0.5rem' }}>
          <div style={{ height: '100%', width: `${neuPct}%`, background: 'var(--sentiment-neu)', borderRadius: 2 }} />
        </div>
      </div>

      {/* Negative Card */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--sentiment-neg)', fontWeight: 500 }}>
            Negative Sentiment
          </span>
          <ThumbsDown size={18} color="var(--sentiment-neg)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--sentiment-neg)' }}>
            {negative}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({negPct}%)
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: '0.5rem' }}>
          <div style={{ height: '100%', width: `${negPct}%`, background: 'var(--sentiment-neg)', borderRadius: 2 }} />
        </div>
      </div>

      {/* Telegram Alerts Card */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 500 }}>
            Telegram Alerts
          </span>
          <Bell size={18} color="#ec4899" />
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ec4899' }}>
          {alerts}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Negative alerts dispatched
        </div>
      </div>
    </div>
  );
}
