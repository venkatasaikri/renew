"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', contentController_1.getPages);
router.get('/:slug', contentController_1.getPageBySlug);
// Protected routes (Admin only)
router.post('/', authMiddleware_1.authMiddleware, contentController_1.createPage);
router.put('/:id', authMiddleware_1.authMiddleware, contentController_1.updatePage);
router.delete('/:id', authMiddleware_1.authMiddleware, contentController_1.deletePage);
exports.default = router;
