const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Token missing" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid or expired token" });
      req.user = decoded; // Save user info
      next();
    });
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = ensureAuthenticated;
