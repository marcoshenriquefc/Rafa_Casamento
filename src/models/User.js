import mongoose from 'mongoose';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  NOIVOS: 'NOIVOS',
  PORTEIRO: 'PORTEIRO',
  CONVIDADO: 'CONVIDADO',
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model('User', userSchema);
