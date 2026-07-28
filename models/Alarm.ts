import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAlarm extends Document {
  time: string;
  label: string;
  days: string[];
  enabled: boolean;
  tone: string;
  challenge: string;
  snoozeMinutes: number;
}

const AlarmSchema: Schema = new mongoose.Schema(
  {
    time: { type: String, required: true }, // "HH:MM"
    label: { type: String, default: 'Alarm' },
    days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    enabled: { type: Boolean, default: true },
    tone: { type: String, default: 'radar' },
    challenge: { type: String, default: 'none' }, // 'none', 'math', 'memory'
    snoozeMinutes: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default (mongoose.models.Alarm as Model<IAlarm>) || mongoose.model<IAlarm>('Alarm', AlarmSchema);
