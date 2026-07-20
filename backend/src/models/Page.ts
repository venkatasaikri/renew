import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'markdown', 'html', 'image', 'list', 'table', 'equation'],
    required: true 
  },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
}, { _id: false });

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  blocks: [blockSchema],
}, { timestamps: true });

export default mongoose.model('Page', pageSchema);
