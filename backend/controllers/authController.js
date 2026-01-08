import { Utilisateur, Role } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    // Find user with role
    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (!utilisateur.actif) {
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé',
      });
    }

    // Verify password
    const isPasswordValid = await utilisateur.comparePassword(mot_de_passe);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Update last login
    utilisateur.derniere_connexion = new Date();
    await utilisateur.save();

    // Generate token
    const token = generateToken({
      id: utilisateur.id,
      email: utilisateur.email,
      role: utilisateur.role?.nom,
    });

    // Remove password from response
    const userData = {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: {
        id: utilisateur.role?.id,
        nom: utilisateur.role?.nom,
        description: utilisateur.role?.description,
      },
      telephone: utilisateur.telephone,
      derniere_connexion: utilisateur.derniere_connexion,
    };

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id, {
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
      data: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: {
          id: utilisateur.role?.id,
          nom: utilisateur.role?.nom,
          description: utilisateur.role?.description,
        },
        telephone: utilisateur.telephone,
        derniere_connexion: utilisateur.derniere_connexion,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // But we can add token blacklisting here if needed
  res.json({
    success: true,
    message: 'Déconnexion réussie',
  });
};

