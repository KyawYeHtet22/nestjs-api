import { Document, Schema } from 'mongoose';

export enum Category {
  ADVENTURE = 'Adventure',
  CLASSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

export interface IBook extends Document {
  title: string;
  description: string;
  author: string;
  price: number;
  category: Category;
}

export const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: Object.values(Category), required: true },
  },
  { timestamps: true },
);
