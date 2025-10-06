import jwt from "jsonwebtoken";


export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is not valid" });
      }

      req.user = user; 
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only!!" });
  }
  next();
};
