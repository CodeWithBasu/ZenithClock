import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPresetTimer extends Document {
  title: string;
  durationSeconds: number;
  category: string;
  icon: string;
}

const PresetTimerSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    durationSeconds: { type: Number, required: true },
    category: { type: String, default: 'Custom' }, // 'Focus', 'Kitchen', 'Fitness', 'Custom'
    icon: { type: String, default: 'Timer' },
  },
  { timestamps: true }
);

export default (mongoose.models.PresetTimer as Model<IPresetTimer>) || mongoose.model<IPresetTimer>('PresetTimer', PresetTimerSchema);
