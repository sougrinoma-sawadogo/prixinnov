import { Structure } from '../models/index.js';

export const createStructure = async (req, res) => {
  try {
    // Clean site_web: convert empty string to null
    let siteWeb = req.body.site_web;
    if (siteWeb === '' || siteWeb === null || siteWeb === undefined) {
      siteWeb = null;
    } else if (typeof siteWeb === 'string') {
      siteWeb = siteWeb.trim();
      if (siteWeb === '') {
        siteWeb = null;
      }
    }

    const structureData = {
      denomination: req.body.denomination,
      sigle: req.body.sigle,
      adresse_postale: req.body.adresse_postale,
      email: req.body.email,
      identite_responsable: req.body.identite_responsable,
      contact_responsable: req.body.contact_responsable,
      site_web: siteWeb,
      type_structure: req.body.type_structure,
      logo_path: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const structure = await Structure.create(structureData);

    res.status(201).json({
      success: true,
      message: 'Structure créée avec succès',
      data: structure,
    });
  } catch (error) {
    console.error('Create structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la structure',
      error: error.message,
    });
  }
};

export const getStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const structure = await Structure.findByPk(id);

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: 'Structure non trouvée',
      });
    }

    res.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    console.error('Get structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la structure',
      error: error.message,
    });
  }
};

export const updateStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const structure = await Structure.findByPk(id);

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: 'Structure non trouvée',
      });
    }

    // Clean site_web: convert empty string to null
    let siteWeb = req.body.site_web;
    if (siteWeb === '' || siteWeb === null || siteWeb === undefined) {
      siteWeb = null;
    } else if (typeof siteWeb === 'string') {
      siteWeb = siteWeb.trim();
      if (siteWeb === '') {
        siteWeb = null;
      }
    }

    const updateData = {
      denomination: req.body.denomination,
      sigle: req.body.sigle,
      adresse_postale: req.body.adresse_postale,
      email: req.body.email,
      identite_responsable: req.body.identite_responsable,
      contact_responsable: req.body.contact_responsable,
      site_web: siteWeb,
      type_structure: req.body.type_structure,
    };

    if (req.file) {
      updateData.logo_path = `/uploads/${req.file.filename}`;
    }

    await structure.update(updateData);

    res.json({
      success: true,
      message: 'Structure mise à jour avec succès',
      data: structure,
    });
  } catch (error) {
    console.error('Update structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la structure',
      error: error.message,
    });
  }
};

