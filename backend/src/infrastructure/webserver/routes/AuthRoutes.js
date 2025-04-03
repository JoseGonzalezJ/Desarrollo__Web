import { Router } from "express";
import AuthService from "../../../application/services/AuthService.js";  // Asegúrate de que este archivo esté bien importado

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const response = await AuthService.register(username, password, role);
    res.status(201).json(response);  // Responder con la respuesta del registro
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await AuthService.login(username, password);
    res.json(response);  // Responder con la respuesta del login
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
