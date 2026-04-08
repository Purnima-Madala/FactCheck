// API service for FactCheck AI Backend
const API_BASE = 'http://localhost:3001/api';

/**
 * Fact-check a claim using the backend API
 * @param {string} query - The claim to verify
 * @returns {Promise<Object>} - Fact-check result with verdict, error%, sources, etc.
 */
export const factCheck = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      // Try to parse error message from backend
      let errorMessage = 'Network error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
      } catch {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Check if it's a network error (backend not running)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to fact-checking service. Please ensure the backend server is running.');
    }
    
    throw error;
  }
};

/**
 * Check if the backend server is running
 * @returns {Promise<boolean>} - True if server is reachable
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.status === 'ok';
    
  } catch {
    return false;
  }
};