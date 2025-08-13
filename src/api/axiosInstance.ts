import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.spacexdata.com',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // You can add headers here if needed
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error?.response || error.message);
    return Promise.reject(error);
  },
);

export default api;
