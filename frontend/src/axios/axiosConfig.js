import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5000', // Set your base URL here
  baseURL: 'https://e-learning-server-7fc6.onrender.com'
});

export default instance;
