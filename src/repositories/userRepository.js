import { UserModel } from '../models/User.js';

export const userRepository = {
  create: (data) => UserModel.create(data),
  findByEmail: (email) => UserModel.findOne({ email: email.toLowerCase().trim() }),
  findById: (id) => UserModel.findById(id),
  save: (user) => user.save(),
  deleteById: (id) => UserModel.findByIdAndDelete(id),
};
