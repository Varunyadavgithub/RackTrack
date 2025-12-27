const BASE_URL = "http://localhost:5000/api/v1";

export const apiClient = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};
