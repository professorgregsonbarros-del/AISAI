import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateReflectionSuggestion } from '../services/ai';

const router = Router();
const prisma = new PrismaClient();

// Create reflection
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { planId, perceptions, difficulties, improvements } = req.body;

    if (!perceptions || !difficulties || !improvements) {
      return res.status(400).json({ error: 'Todos os campos de reflexão são obrigatórios' });
    }

    const reflection = await prisma.reflection.create({
      data: {
        userId: req.userId!,
        planId: planId || null,
        perceptions,
        difficulties,
        improvements,
      },
    });

    res.status(201).json(reflection);
  } catch (error) {
    console.error('Create reflection error:', error);
    res.status(500).json({ error: 'Erro ao criar reflexão' });
  }
});

// List reflections
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reflections = await prisma.reflection.findMany({
      where: { userId: req.userId as string },
      orderBy: { createdAt: 'desc' },
      include: { plan: { select: { title: true, subject: true } } },
    });

    res.json(reflections);
  } catch (error) {
    console.error('List reflections error:', error);
    res.status(500).json({ error: 'Erro ao listar reflexões' });
  }
});

// Generate AI suggestion for a reflection
router.post('/:id/suggest', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const reflection = await prisma.reflection.findFirst({
      where: { id, userId: req.userId as string },
      include: { plan: true },
    });

    if (!reflection) return res.status(404).json({ error: 'Reflexão não encontrada' });

    const suggestion = await generateReflectionSuggestion(
      reflection.perceptions,
      reflection.difficulties,
      reflection.improvements,
      reflection.plan?.title ?? undefined
    );

    const updated = await prisma.reflection.update({
      where: { id: reflection.id },
      data: { aiSuggestion: suggestion },
    });

    res.json(updated);
  } catch (error) {
    console.error('Suggest error:', error);
    res.status(500).json({ error: 'Erro ao gerar sugestão' });
  }
});

export default router;
