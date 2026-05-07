import express from 'express';
import { aiService } from '../lib/ai';
import asyncMiddleware from '../middlewares/async';
import { z } from 'zod';

const router = express.Router();

const codeSchema = z.object({
  code: z.string().min(1),
  language: z.string().optional(),
});

router.post('/explain', asyncMiddleware(async (req, res) => {
  const { code, language } = codeSchema.parse(req.body);
  const explanation = await aiService.explainCode(code, language || 'code');
  res.json({ explanation });
}));

router.post('/suggest-meta', asyncMiddleware(async (req, res) => {
  const { code, language } = codeSchema.parse(req.body);
  const suggestions = await aiService.suggestMetadata(code, language || 'code');
  res.json(suggestions);
}));

router.post('/detect-language', asyncMiddleware(async (req, res) => {
  const { code } = codeSchema.parse(req.body);
  const language = await aiService.detectLanguage(code);
  res.json({ language });
}));

export default router;
