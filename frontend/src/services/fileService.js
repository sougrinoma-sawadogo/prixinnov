import api from './api';

export const fileService = {
  uploadPieceJointe: async (candidatureId, file, libelle = 'Contrat') => {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('candidature_id', candidatureId);
    formData.append('libelle', libelle);

    const response = await api.post('/pieces-jointes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadPieceJointe: async (id) => {
    const response = await api.get(`/pieces-jointes/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deletePieceJointe: async (id) => {
    const response = await api.delete(`/pieces-jointes/${id}`);
    return response.data;
  },
};

