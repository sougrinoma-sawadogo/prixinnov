import { Utilisateur, Role } from '../models/index.js';
import { Op } from 'sequelize';

export const getUtilisateurs = async (req, res) => {
  try {
    const { role, actif, page = 1, limit = 10 } = req.query;

    const where = {};
    if (role) {
      where.role_id = role;
    }
    if (actif !== undefined) {
      where.actif = actif === 'true';
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const utilisateurs = await Utilisateur.findAndCountAll({
      where,
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['mot_de_passe'] },
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: utilisateurs.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: utilisateurs.count,
        totalPages: Math.ceil(utilisateurs.count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get utilisateurs error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message,
    });
  }
};

export const getUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['mot_de_passe'] },
    });

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    res.json({
      success: true,
      data: utilisateur,
    });
  } catch (error) {
    console.error('Get utilisateur error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message,
    });
  }
};

export const createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role_id, telephone } = req.body;

    // Check if email already exists
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }

    // Verify role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rôle non trouvé',
      });
    }

    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe,
      role_id,
      telephone,
      actif: true,
    });

    // Remove password from response
    const userData = utilisateur.toJSON();
    delete userData.mot_de_passe;

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: userData,
    });
  } catch (error) {
    console.error('Create utilisateur error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message,
    });
  }
};

export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const updateData = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone,
      role_id: req.body.role_id,
    };

    // If password is provided, it will be hashed by the model hook
    if (req.body.mot_de_passe) {
      updateData.mot_de_passe = req.body.mot_de_passe;
    }

    await utilisateur.update(updateData);

    // Remove password from response
    const userData = utilisateur.toJSON();
    delete userData.mot_de_passe;

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: userData,
    });
  } catch (error) {
    console.error('Update utilisateur error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message,
    });
  }
};

export const toggleActif = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Prevent deactivating yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas désactiver votre propre compte',
      });
    }

    await utilisateur.update({ actif: !utilisateur.actif });

    res.json({
      success: true,
      message: `Utilisateur ${utilisateur.actif ? 'activé' : 'désactivé'} avec succès`,
      data: utilisateur,
    });
  } catch (error) {
    console.error('Toggle actif error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du statut',
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nouveau_mot_de_passe } = req.body;

    if (!nouveau_mot_de_passe || nouveau_mot_de_passe.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
    }

    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    await utilisateur.update({ mot_de_passe: nouveau_mot_de_passe });

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: error.message,
    });
  }
};

