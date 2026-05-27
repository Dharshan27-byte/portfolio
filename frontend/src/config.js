// API endpoint configuration
const isProd = import.meta.env.PROD;

export const API_BASE_URL = isProd 
  ? '/api' 
  : 'http://localhost:5000/api';

export const FILE_BASE_URL = isProd 
  ? '' 
  : 'http://localhost:5000';
