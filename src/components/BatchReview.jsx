import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ThumbsUp, 
  Minus, 
  ThumbsDown, 
  Play, 
  Trash2,
  AlertCircle
} from 'lucide-react';

const SAMPLE_BATCH = [
  "This vacuum cleaner has completely changed my daily routine, incredibly powerful suction!",
  "Arrived broken, the wheel was detached and packaging looked crushed.",
  "Standard shipping time, item works as described in the specifications.",
  "Customer service answered within 2 minutes and resolved my billing issue right away.",
  "Do not waste your money on this, absolute scam and stopped working after 3 days.",
  "Pretty average build for the price point, decent but nothing to write home about.",
  "Outstanding taste and wonderful aroma, will definitely buy again!",
  "Horrible experience, never ordering from this vendor again.",
  "Neutral impression so far, only used it once so cannot say for sure.",
  "Five stars! Easy to assemble, sturdy material and sleek modern design."
].join('\n');

export default function BatchReview({ onBatchAnalyze, loading }) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Extract reviews from textarea
  const getReviewList = () => {
    return inputText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  };

  const reviewList = getReviewList();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      // Check if CSV
      if (file.name.endsWith('.csv')) {
        const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length > 0) {
          const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
          // Look for text or review column
          let colIdx = header.findIndex(h => h.includes('text') || h.includes('review') || h.includes('comment'));
          if (colIdx === -1) colIdx = 0; // fallback to first column

          const extracted = [];
          for (let i = 1; i < lines.length; i++) {
            // Basic CSV row split handling
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (cols[colIdx]) {
              extracted.push(cols[colIdx].trim().replace(/^"|"$/g, ''));
            }
          }
          setInputText(extracted.join('\n'));
        }
      } else {
        // Plain text file: one per line
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRunBatch = () => {
    if (reviewList.length === 0 || loading) return;
    setErrorMsg('');

    onBatchAnalyze(reviewList, (batchResults) => {
      setResults(batchResults);
    });
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = ['Review', 'Sentiment', 'Confidence', 'Cleaned_Text'];
    const rows = results.map(r => [
      `"${(r.text || '').replace(/"/g, '""')}"`,
      `"${r.sentiment || ''}"`,
      r.confidence ? r.confidence.toFixed(4) : '',
      `"${(r.cleaned_text || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analyzed_reviews_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Results
  const filteredResults = results.filter(item => {
    const matchesSentiment = filterSentiment === 'all' || item.sentiment === filterSentiment;
    const matchesSearch = !searchQuery || 
      (item.text && item.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.cleaned_text && item.cleaned_text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSentiment && matchesSearch;
  });

  // Batch Statistics
  const batchStats = {
    total: results.length,
    positive: results.filter(r => r.sentiment === 'positive').length,
    neutral: results.filter(r => r.sentiment === 'neutral').length,
    negative: results.filter(r => r.sentiment === 'negative').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Upload and Paste Section */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent-primary)" />
              Batch Review Classification
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Paste multiple customer reviews (one per line) or upload a CSV / TXT file.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setInputText(SAMPLE_BATCH);
                setFileName('sample_batch.txt');
              }}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              Load Sample Batch (10 Reviews)
            </button>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              <Upload size={14} />
              <span>{fileName ? `File: ${fileName}` : 'Upload CSV / TXT'}</span>
              <input 
                type="file" 
                accept=".csv,.txt" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </label>

            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setFileName('');
                  setResults([]);
                }}
                className="btn btn-secondary btn-sm"
                title="Clear all"
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Input Textarea */}
        <textarea
          className="textarea-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste reviews here, one per line...&#10;E.g.&#10;Great product, loved it!&#10;Terrible customer support, broke immediately.&#10;Fair quality for the price."
          rows={7}
          style={{ marginBottom: '0.75rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Detected: <strong>{reviewList.length}</strong> review{reviewList.length !== 1 ? 's' : ''} to process
          </span>

          <button
            onClick={handleRunBatch}
            disabled={reviewList.length === 0 || loading}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {loading ? (
              <>
                <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span>Classifying Batch ({reviewList.length} items)...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Run Batch Classification</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}
      </div>

      {/* Batch Results Section */}
      {results.length > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
          {/* Header & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                Batch Classification Results ({results.length} total)
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>
                  <strong style={{ color: 'var(--sentiment-pos)' }}>{batchStats.positive}</strong> positive ({Math.round((batchStats.positive / batchStats.total) * 100)}%)
                </span>
                <span>
                  <strong style={{ color: 'var(--sentiment-neu)' }}>{batchStats.neutral}</strong> neutral ({Math.round((batchStats.neutral / batchStats.total) * 100)}%)
                </span>
                <span>
                  <strong style={{ color: 'var(--sentiment-neg)' }}>{batchStats.negative}</strong> negative ({Math.round((batchStats.negative / batchStats.total) * 100)}%)
                </span>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn btn-secondary btn-sm"
            >
              <Download size={14} /> Export Results to CSV
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="text-input"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['all', 'positive', 'neutral', 'negative'].map((sentiment) => (
                <button
                  key={sentiment}
                  onClick={() => setFilterSentiment(sentiment)}
                  className={`btn btn-sm ${filterSentiment === sentiment ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {sentiment}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem', width: 45 }}>#</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Review Text</th>
                  <th style={{ padding: '0.75rem 1rem', width: 120 }}>Sentiment</th>
                  <th style={{ padding: '0.75rem 1rem', width: 100 }}>Confidence</th>
                  <th style={{ padding: '0.75rem 1rem', width: 180 }}>Cleaned Tokens</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No reviews match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((item, index) => {
                    const badgeClass = 
                      item.sentiment === 'positive' ? 'badge-positive' :
                      item.sentiment === 'negative' ? 'badge-negative' : 'badge-neutral';

                    return (
                      <tr 
                        key={index} 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)',
                          background: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                        }}
                      >
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', maxWidth: 420 }}>
                          {item.text}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge ${badgeClass}`}>
                            {item.sentiment === 'positive' && <ThumbsUp size={12} />}
                            {item.sentiment === 'negative' && <ThumbsDown size={12} />}
                            {item.sentiment === 'neutral' && <Minus size={12} />}
                            {item.sentiment}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {item.confidence ? `${Math.round(item.confidence * 100)}%` : '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#93c5fd' }}>
                          {item.cleaned_text || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
