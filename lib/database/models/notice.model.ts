import { Document, Schema, model, models } from "mongoose";

export interface INoticeBoard extends Document {
  _id: string;
  notice: string;
}

const NoticeBoardSchema = new Schema({
  notice: { type: String, required: true, unique: true },
});

const NoticeBoard = models.NoticeBoard || model("NoticeBoard", NoticeBoardSchema);

export default NoticeBoard;
