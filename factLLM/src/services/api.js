const API_BASE = 'http://localhost:3001/api';

export const factCheck = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/fact-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      let errorMessage = 'Network error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
      } catch {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to backend. Please ensure server is running on localhost:3001');
    }
    throw error;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
};