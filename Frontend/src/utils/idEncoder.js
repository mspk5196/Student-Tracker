// Utility functions for encoding/decoding IDs for URL security
// This provides obfuscation to prevent casual ID enumeration

const SECRET_PREFIX = 'ST_'; // Student Tracker prefix

/**
 * Encode an ID for use in URLs
 * @param {number|string} id - The ID to encode
 * @returns {string} - Encoded ID string
 */
export const encodeId = (id) => {
  if (!id) return '';
  const payload = `${SECRET_PREFIX}${id}_${Date.now()}`;
  return btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Decode an encoded ID from URL
 * @param {string} encodedId - The encoded ID string
 * @returns {string|null} - The decoded ID or null if invalid
 */
export const decodeId = (encodedId) => {
  if (!encodedId) return null;
  try {
    // Add back padding if needed
    let base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = atob(base64);
    
    // Extract ID from payload
    if (decoded.startsWith(SECRET_PREFIX)) {
      const parts = decoded.slice(SECRET_PREFIX.length).split('_');
      return parts[0] || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode ID:', error);
    return null;
  }
};

/**
 * Simple encode without timestamp (for consistent URLs)
 * @param {number|string} id - The ID to encode
 * @returns {string} - Encoded ID string
 */
export const encodeIdSimple = (id) => {
  if (!id) return '';
  const payload = `${SECRET_PREFIX}${id}`;
  return btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Decode simple encoded ID
 * @param {string} encodedId - The encoded ID string
 * @returns {string|null} - The decoded ID or null if invalid
 */
export const decodeIdSimple = (encodedId) => {
  if (!encodedId) return null;
  try {
    let base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = atob(base64);
    
    if (decoded.startsWith(SECRET_PREFIX)) {
      return decoded.slice(SECRET_PREFIX.length) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode ID:', error);
    return null;
  }
};
