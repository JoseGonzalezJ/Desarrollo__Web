import FungusRepository from "../../domain/repositories/FungusRepository.js";

const fungusRepository = new FungusRepository();

class FungusService {
  async createFungus(data) {
    return await fungusRepository.createFungus(data);
  }

  async getAllFungi() {
    return await fungusRepository.getAllFungi();
  }

  async updateFungus(data) {
    return await fungusRepository.updateFungus(data);
  }

  async deleteFungus(id) {
    return await fungusRepository.deleteFungus(id);
  }
}

export default FungusService;
