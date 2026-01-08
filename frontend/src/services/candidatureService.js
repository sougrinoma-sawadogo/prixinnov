import api from './api';

export const candidatureService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/candidatures?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/candidatures/${id}`);
    return response.data;
  },

  getStatus: async (id) => {
    const response = await api.get(`/candidatures/statut/${id}`);
    return response.data;
  },

  create: async (candidatureData) => {
    const response = await api.post('/candidatures', candidatureData);
    return response.data;
  },

  getByStructure: async (structureId) => {
    const response = await api.get(`/candidatures/structure/${structureId}`);
    return response.data;
  },
};

