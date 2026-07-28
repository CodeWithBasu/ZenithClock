import mongoose from 'mongoose';

const PresetTimerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    durationSeconds: { type: Number, required: true },
    category: { type: String, default: 'Custom' }, // 'Focus', 'Kitchen', 'Fitness', 'Custom'
    icon: { type: String, default: 'Timer' },
  },
  { timestamps: true }
);

export default mongoose.models.PresetTimer || mongoose.model('PresetTimer', PresetTimerSchema);
