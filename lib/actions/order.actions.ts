"use server";

import { CreateOrderParams, getOrdersByEmailParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import User from "../database/models/user.model";
import Resource from "../database/models/resource.model";

// CREATE ORDER
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    if (!order.resourceId) {
      throw new Error("Resource ID is required to create an order.");
    }

    const newOrder = await Order.create({
      price: order.price,
      isFree: order.isFree,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerNumber: order.buyerNumber,
      note: order.note,
      url:order.url,
      delivered: false, 
      createdAt: order.createdAt,
      resource: order.resourceId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE ORDER DELIVERED STATUS
export const updateOrderStatus = async (orderId: string, delivered: boolean) => {
  try {
    await connectToDatabase();

    if (!orderId) throw new Error("Order ID is required");

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { delivered },
      { new: true }
    );

    if (!updatedOrder) throw new Error("Order not found");

    return JSON.parse(JSON.stringify(updatedOrder));
  } catch (error) {
    handleError(error);
  }
};

// GET ALL ORDERS
export const getAllOrders = async () => {
  try {
    await connectToDatabase();

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "resources",
          localField: "resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          _id: 1,
          price: 1,
          createdAt: 1,
          resourceTitle: "$resource.title",
          resourceId: "$resource._id",
          buyerName: 1,
          buyerEmail: 1,
          buyerNumber: 1,
          delivered: 1,
          note: 1,
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// GET ORDERS BY EMAIL (WITH PAGINATION)
export async function getOrdersByEmail({
  email,
  limit = 3,
  page = 1,
}: getOrdersByEmailParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyerEmail: email };

    const orders = await Order.find(conditions)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "resource",
        model: Resource,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// DELETE ORDER BY ID
export const deleteOrder = async (orderId: string) => {
  try {
    await connectToDatabase();

    if (!orderId) throw new Error("Order ID is required");

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) throw new Error("Order not found");

    return { message: "Order successfully deleted" };
  } catch (error) {
    handleError(error);
  }
};
