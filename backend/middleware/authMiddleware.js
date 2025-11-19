import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("authenticateJWT called, authHeader:", authHeader);
  if (!authHeader)
    return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Invalid or expired token" });

    req.user = user;
    next();
  });
};


export const isAdmin = (req, res, next) => {
  // console.log("isAdmin called, req.user:", req.user);
  if (!req.user?.role)
    return res.status(403).json({ error: "User role missing in token" });

  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied. Admin only!" });

  next();
};
