import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso no autorizado" });

  try {
    const decoded = jwt.verify(token, "secreto");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });
  next();
};

export { authenticate, authorizeAdmin };
