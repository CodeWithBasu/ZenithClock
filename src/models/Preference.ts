import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPreference extends Document {
  userId: string;
  theme: string;
  clockFormat: string;
  defaultAlarmTone: string;
  ambientSound: string;
  pinnedCities: string[];
}

const PreferenceSchema: Schema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    theme: { type: String, default: 'cyber' }, // 'cyber', 'aurora', 'obsidian', 'minimal', 'sunburst'
    clockFormat: { type: String, default: '24h' }, // '12h', '24h'
    defaultAlarmTone: { type: String, default: 'radar' },
    ambientSound: { type: String, default: 'none' }, // 'none', 'rain', 'ocean', 'space'
    pinnedCities: { type: [String], default: ['Tokyo', 'New York', 'London'] },
  },
  { timestamps: true }
);

export default (mongoose.models.Preference as Model<IPreference>) || mongoose.model<IPreference>('Preference', PreferenceSchema);
