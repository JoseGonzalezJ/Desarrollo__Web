import UserRepository from "../../domain/repositories/UserRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async register(username, password, role) {
    const existingUser = await UserRepository.findUserByUsername(username);
    if (existingUser) throw new Error("El usuario ya existe");

    await UserRepository.createUser(username, password, role);
    return { message: "Usuario registrado con éxito" };
  }

  async login(username, password) {
    const user = await UserRepository.findUserByUsername(username);
    if (!user) throw new Error("Usuario o contraseña incorrectos");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Usuario o contraseña incorrectos");

    const token = jwt.sign({ id: user.id, role: user.role }, "secreto", { expiresIn: "1h" });
    return { token, role: user.role };
  }
}

export default new AuthService();
