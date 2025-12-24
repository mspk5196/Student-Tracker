// src/api/apiRequest.js

const API_URL = import.meta.env.VITE_API_URL;

export const makeRequest = async ({
  url,
  method = 'GET',
  data = null,
  token, // ✅ passed from component
}) => {
  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};
