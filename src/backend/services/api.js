import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const sendContact = async (data) => {
  try {
    const response = await api.post('/inquiries', data);
    return response.data;
  } catch (error) {
    console.error('Error sending contact:', error);
    throw error;
  }
};

export const createBooking = async (data) => {
  try {
    const response = await api.post('/bookings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export default api;
