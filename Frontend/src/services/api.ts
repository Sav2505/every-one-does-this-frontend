import axios from 'axios';
import { CONFIG_API } from '../configs';

export const fetchMessageAPI = async () => {
  try {
    const response = await axios.get(`http://${CONFIG_API.BASE_URL}:5000/`);
    return response.data;
    
  } catch (error) {
    console.error('Error fetching message:', error);
    throw error;
  }
};
