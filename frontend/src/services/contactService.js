import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export const contactService = {
  // Get all contacts
  async getContacts() {
    const response = await api.get('/contacts');
    return response.data;
  },

  // Get a specific contact by ID
  async getContact(id) {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  // Create a new contact
  async createContact(contactData) {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  // Update an existing contact
  async updateContact(id, contactData) {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data;
  },

  // Delete a contact
  async deleteContact(id) {
    await api.delete(`/contacts/${id}`);
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },
};
