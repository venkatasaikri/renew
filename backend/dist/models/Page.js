"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blockSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: ['text', 'markdown', 'html', 'image', 'list', 'table', 'equation'],
        required: true
    },
    content: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
}, { _id: false });
const pageSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Page', pageSchema);
