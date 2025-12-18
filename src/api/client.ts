import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:4000';

const client = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
