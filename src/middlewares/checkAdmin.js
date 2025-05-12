// backend/middleware/checkAdmin.js
const admin = require("firebase-admin");

const checkAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // ✅ Custom role check
    if (decodedToken.role === "admin") {
      req.user = decodedToken;
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = checkAdmin;
