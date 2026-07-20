import { Request, Response } from 'express';
import Page from '../models/Page';

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages', error });
  }
};

export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page', error });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, blocks } = req.body;
    const newPage = new Page({ title, slug, blocks });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ message: 'Error creating page', error });
  }
};

export const updatePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, blocks } = req.body;
    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { title, slug, blocks },
      { new: true, runValidators: true }
    );
    if (!updatedPage) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }
    res.json(updatedPage);
  } catch (error) {
    res.status(400).json({ message: 'Error updating page', error });
  }
};

export const deletePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);
    if (!deletedPage) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page', error });
  }
};
