import api from './api';

export const structureService = {
  create: async (structureData, logoFile) => {
    const formData = new FormData();
    Object.keys(structureData).forEach(key => {
      formData.append(key, structureData[key]);
    });
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const response = await api.post('/structures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/structures/${id}`);
    return response.data;
  },

  update: async (id, structureData, logoFile) => {
    const formData = new FormData();
    Object.keys(structureData).forEach(key => {
      formData.append(key, structureData[key]);
    });
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const response = await api.put(`/structures/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

