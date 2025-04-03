import User from "../models/User.js";

class UserRepository {
  async createUser(username, password, role) {
    return await User.create({ username, password, role });
  }

  async findUserByUsername(username) {
    return await User.findOne({ where: { username } });
  }
}

export default new UserRepository();
