import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesAPI = {
  // Get all notes
  getAllNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Get note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create new note
  createNote: async (noteData) => {
    try {
      console.log('API: Creating note with data:', noteData);
      const response = await api.post('/notes', noteData);
      console.log('API: Note created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error creating note:', error);
      throw error;
    }
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Search notes
  searchNotes: async (query) => {
    const response = await api.get('/notes/search', { params: { q: query } });
    return response.data;
  },

  // Get notes by category
  getNotesByCategory: async (category) => {
    const response = await api.get(`/notes/category/${category}`);
    return response.data;
  },

  // Toggle pin status
  togglePinNote: async (id) => {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },

  // Toggle archive status
  toggleArchiveNote: async (id) => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/notes/categories');
    return response.data;
  },
};

export default api;

