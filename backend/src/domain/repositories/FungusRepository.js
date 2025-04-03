import Fungus from "../models/Fungus.js";

class FungusRepository {
  async createFungus(data) {
    return await Fungus.create(data);
  }

  async getAllFungi() {
    return await Fungus.findAll();
  }

  async updateFungus(data) {
    const fungus = await Fungus.findByPk(data.id);
    if (fungus) {
      return await fungus.update(data);
    }
    throw new Error("Fungus not found");
  }

  async deleteFungus(id) {
    const fungus = await Fungus.findByPk(id);
    if (fungus) {
      await fungus.destroy();
      return { message: "Fungus deleted successfully" };
    }
    throw new Error("Fungus not found");
  }
}

export default FungusRepository;
