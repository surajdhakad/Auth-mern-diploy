const ensureAdmin = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = ensureAdmin;
