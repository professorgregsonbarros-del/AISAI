import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get trail content (optionally filtered by context)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const context = req.query.context as string | undefined;
    const where: any = {};
    if (context) where.context = context;

    const trails = await prisma.trailContent.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    res.json(trails);
  } catch (error) {
    console.error('List trails error:', error);
    res.status(500).json({ error: 'Erro ao listar trilhas' });
  }
});

export default router;
