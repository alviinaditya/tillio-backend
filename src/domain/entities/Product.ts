import { Types } from "mongoose";

export class Product {
  constructor(
    public readonly _id: Types.ObjectId,
    public name: string,
    public description: string,
    public price: number,
    public categoryId: Types.ObjectId,
    public stock: number,
    public sku: string,
    public image: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
