"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.createPage = exports.getPageBySlug = exports.getPages = void 0;
const Page_1 = __importDefault(require("../models/Page"));
const getPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pages = yield Page_1.default.find().sort({ createdAt: -1 });
        res.json(pages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pages', error });
    }
});
exports.getPages = getPages;
const getPageBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = yield Page_1.default.findOne({ slug: req.params.slug });
        if (!page) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.json(page);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
});
exports.getPageBySlug = getPageBySlug;
const createPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, slug, blocks } = req.body;
        const newPage = new Page_1.default({ title, slug, blocks });
        yield newPage.save();
        res.status(201).json(newPage);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating page', error });
    }
});
exports.createPage = createPage;
const updatePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, slug, blocks } = req.body;
        const updatedPage = yield Page_1.default.findByIdAndUpdate(req.params.id, { title, slug, blocks }, { new: true, runValidators: true });
        if (!updatedPage) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.json(updatedPage);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating page', error });
    }
});
exports.updatePage = updatePage;
const deletePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPage = yield Page_1.default.findByIdAndDelete(req.params.id);
        if (!deletedPage) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.json({ message: 'Page deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting page', error });
    }
});
exports.deletePage = deletePage;
