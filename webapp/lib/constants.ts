export const API_URL =
  (typeof window === 'undefined' && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

export const AUTH_TOKEN_KEY = 'tienda_auth_token';

export const ITEMS_PER_PAGE = 12;
