import mongoose, { Schema, Document, models } from "mongoose";

export interface IProject extends Document {
  name: string;
  github: string;
  live?: string;
  photos?: string[];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true, unique: true },
  github: { type: String, required: true },
  live: String,
  photos: [String],
});

export default models.Project || mongoose.model<IProject>("Project", ProjectSchema);
