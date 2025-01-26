"use server";

import { AddNoticeParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import NoticeBoard from "../database/models/notice.model";

export const addNotice = async ({ Notice }: AddNoticeParams) => {
  try {
    await connectToDatabase();

    const newNoticeBoard = await NoticeBoard.create({ notice: Notice });

    return JSON.parse(JSON.stringify(newNoticeBoard));
  } catch (error) {
    handleError(error);
  }
};

export const getAllNotice = async () => {
  try {
    await connectToDatabase();

    const noticeBoard = await NoticeBoard.find();

    return JSON.parse(JSON.stringify(noticeBoard));
  } catch (error) {
    handleError(error);
  }
};

export const deleteNotice = async (noticeId: string) => {
  try {
    await connectToDatabase();

    const deletedNotice = await NoticeBoard.findByIdAndDelete(noticeId);

    if (!deletedNotice) {
      throw new Error("Notice not found");
    }

    return { message: "Notice deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
