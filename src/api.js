/**
 * API Service for Customer Review Sentiment Backend
 */

const DEFAULT_BASE_URL = 'https://customer-sentimental-analysis-backend.onrender.com/';

export const getStoredBaseUrl = () => {
  return localStorage.getItem('nlp_backend_url') || DEFAULT_BASE_URL;
};

export const setStoredBaseUrl = (url) => {
  if (!url) {
    localStorage.removeItem('nlp_backend_url');
  } else {
    localStorage.setItem('nlp_backend_url', url.replace(/\/+$/, ''));
  }
};

/**
 * Check backend connectivity and retrieve health status
 */
export async function checkBackendHealth(baseUrl = getStoredBaseUrl()) {
  const url = baseUrl.replace(/\/+$/, '');
  try {
    const res = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return { ok: true, data: await res.json() };
  } catch (err) {
    // Try fallback to root /
    try {
      const fallbackRes = await fetch(`${url}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (fallbackRes.ok) {
        return { ok: true, data: await fallbackRes.json() };
      }
    } catch {
      // ignore
    }
    return { ok: false, error: err.message || 'Cannot connect to backend' };
  }
}

/**
 * Predict sentiment for a single review
 */
export async function predictReview(text, baseUrl = getStoredBaseUrl()) {
  const url = baseUrl.replace(/\/+$/, '');
  
  const response = await fetch(`${url}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Server returned ${response.status}: ${errText || response.statusText}`);
  }

  const data = await response.json();
  
  // Guarantee unified structure even with minimal backend
  return {
    sentiment: data.sentiment || 'neutral',
    confidence: typeof data.confidence === 'number' ? data.confidence : 1.0,
    probabilities: data.probabilities || {
      positive: data.sentiment === 'positive' ? 1.0 : 0.0,
      neutral: data.sentiment === 'neutral' ? 1.0 : 0.0,
      negative: data.sentiment === 'negative' ? 1.0 : 0.0,
    },
    cleaned_text: data.cleaned_text || '',
    alert_sent: Boolean(data.alert_sent),
  };
}

/**
 * Predict sentiment for multiple reviews in batch
 */
export async function predictBatchReviews(reviews, baseUrl = getStoredBaseUrl()) {
  const url = baseUrl.replace(/\/+$/, '');
  
  // Attempt /predict/batch first
  try {
    const response = await fetch(`${url}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ reviews }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.results;
    }
  } catch (e) {
    console.warn('Batch endpoint failed, falling back to sequential /predict:', e);
  }

  // Fallback: sequential / concurrent individual requests
  const results = [];
  for (const text of reviews) {
    try {
      const res = await predictReview(text, url);
      results.push({
        text,
        ...res,
      });
    } catch (err) {
      results.push({
        text,
        sentiment: 'error',
        error: err.message,
        confidence: 0,
        probabilities: {},
        cleaned_text: '',
        alert_sent: false,
      });
    }
  }
  return results;
}
