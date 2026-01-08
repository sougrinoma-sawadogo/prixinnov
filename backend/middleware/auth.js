import { verifyToken } from '../utils/jwt.js';
import { Utilisateur } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'authentification manquant' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);
      
      // Fetch user from database
      const utilisateur = await Utilisateur.findByPk(decoded.id, {
        include: [{ model: (await import('../models/index.js')).Role, as: 'role' }],
        attributes: { exclude: ['mot_de_passe'] },
      });

      if (!utilisateur) {
        return res.status(401).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      if (!utilisateur.actif) {
        return res.status(403).json({ 
          success: false, 
          message: 'Compte désactivé' 
        });
      }

      // Attach user to request
      req.user = utilisateur;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur d\'authentification', 
      error: error.message 
    });
  }
};

