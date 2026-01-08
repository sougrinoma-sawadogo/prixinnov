export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentification requise' 
      });
    }

    const userRole = req.user.role?.nom;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

export const requireSuperAdmin = requireRole('super_admin');
export const requireAdmin = requireRole('secretaire_technique', 'comite_coordination', 'super_admin');

