import { Document, Schema, model, models } from "mongoose";

export interface IModerator extends Document {
  _id: string;
  name: string;
  email: string;
}

const ModeratorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

const Moderator = models.Moderator || model("Moderator", ModeratorSchema);

export default Moderator;
