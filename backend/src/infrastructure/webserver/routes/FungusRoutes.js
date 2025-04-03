import express from "express";
import FungusService from "../../../application/services/FungusService.js";

const router = express.Router();
const fungusService = new FungusService();

router.post("/", async (req, res) => {
  try {
    const fungus = await fungusService.createFungus(req.body);
    res.status(201).json(fungus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const fungi = await fungusService.getAllFungi();
    res.status(200).json(fungi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedFungus = await fungusService.updateFungus({ id: req.params.id, ...req.body });
    res.status(200).json(updatedFungus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await fungusService.deleteFungus(req.params.id);
    res.status(200).json({ message: "Fungus deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;