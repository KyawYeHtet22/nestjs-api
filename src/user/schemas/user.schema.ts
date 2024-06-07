import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

export const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true },
);
