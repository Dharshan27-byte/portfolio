// API endpoint configuration
const isProd = import.meta.env.PROD;

export const API_BASE_URL = isProd 
  ? '/api' 
  : 'https://portfolio-yr7b.onrender.com';

export const FILE_BASE_URL = isProd 
  ? '' 
  : 'https://portfolio-yr7b.onrender.com';
