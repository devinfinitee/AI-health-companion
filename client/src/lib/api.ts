/**
 * API UTILITY FUNCTIONS
 * Helper functions for making authenticated API requests to the backend
 */

// API base URL - uses environment variable or defaults to localhost:5001
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * Get the JWT token from localStorage
 * @returns The stored JWT token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Make an authenticated API request
 * Automatically includes the JWT token in the Authorization header
 * 
 * @param endpoint - API endpoint (e.g., "/dashboard/health/summary")
 * @param options - Fetch options (method, body, etc.)
 * @returns Promise with the response data
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  // Get the JWT token from localStorage
  const token = getToken();

  // Set up headers with authentication token
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Make the API request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse the JSON response
  const data = await response.json();

  // If request failed, throw error with message from server
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

/**
 * GET request helper
 * @param endpoint - API endpoint
 * @returns Promise with the response data
 */
export const get = (endpoint: string) => {
  return apiRequest(endpoint, { method: "GET" });
};

/**
 * POST request helper
 * @param endpoint - API endpoint
 * @param body - Request body data
 * @returns Promise with the response data
 */
export const post = (endpoint: string, body: any) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * PUT request helper
 * @param endpoint - API endpoint
 * @param body - Request body data
 * @returns Promise with the response data
 */
export const put = (endpoint: string, body: any) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request helper
 * @param endpoint - API endpoint
 * @returns Promise with the response data
 */
export const del = (endpoint: string) => {
  return apiRequest(endpoint, { method: "DELETE" });
};

// Export API_URL for use in other files
export { API_URL };
