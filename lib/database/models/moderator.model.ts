import { Document, Schema, Types, model, models } from "mongoose";

export interface IModerator extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

const ModeratorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

const Moderator = models.Moderator || model("Moderator", ModeratorSchema);

export default Moderator;
