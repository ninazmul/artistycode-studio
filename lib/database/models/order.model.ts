import { Schema, model, models, Document } from "mongoose";

// Main Order Interface
export interface IOrder extends Document {
  createdAt: Date;
  price: string;
  isFree: boolean;
  buyerName: string;
  buyerEmail: string;
  buyerNumber: string;
  note: string;
  url: string;
  delivered: boolean;
  resource:
    | Schema.Types.ObjectId
    | {
        _id: string;
        title: string;
      };
}

// Optional: If you're using order listings somewhere else
export type IOrderItem = {
  _id: string;
  price: string;
  isFree: boolean;
  buyerName: string;
  buyerEmail: string;
  buyerNumber: string;
  note: string;
  url: string;
  delivered: string;
  createdAt: Date;
  resourceTitle: string;
  resourceId: string;
};

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    price: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    buyerNumber: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create model if it doesn't already exist
const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
