"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
} from "@/types";
import Event from "../database/models/event.model";

// CREATE
export async function createEvent({ event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    const newEvent = await Event.create({
      ...event,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId);

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate) {
      throw new Error("Event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit = 6,
  page,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    const conditions = {
      $and: [titleCondition],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await eventsQuery;
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
