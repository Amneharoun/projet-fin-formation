// middlewares/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("Accès refusé, token manquant");
        
        return res.status(401).json({ message: "Accès refusé, token manquant" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Si on a donné des rôles autorisés
      // if (roles.length && !roles.includes(decoded.role)) {
      //   return res.status(403).json({ message: "Accès interdit" });
      // }

      next();
    } catch (err) {
      res.status(401).json({ message: "Token invalide" });
    }
  };
};

module.exports = authMiddleware;
