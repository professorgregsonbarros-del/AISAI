import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateMaterial } from '../services/ai';

const router = Router();
const prisma = new PrismaClient();

// Generate material with AI
router.post('/generate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type, planId } = req.body;

    if (!type || !planId) {
      return res.status(400).json({ error: 'Tipo e plano são obrigatórios' });
    }

    const plan = await prisma.lessonPlan.findFirst({
      where: { id: planId, userId: req.userId as string },
    });

    if (!plan) return res.status(404).json({ error: 'Plano não encontrado' });

    const aiContent = await generateMaterial(type, {
      planTitle: plan.title,
      subject: plan.subject,
      level: plan.level,
      objectives: plan.objectives,
    });

    let parsedContent;
    try {
      parsedContent = JSON.parse(aiContent);
    } catch {
      parsedContent = { text: aiContent };
    }

    const typeLabels: Record<string, string> = {
      quiz: 'Quiz Diagnóstico',
      summary: 'Resumo',
      'video-script': 'Roteiro de Vídeo',
      activity: 'Atividade Colaborativa',
    };

    const material = await prisma.material.create({
      data: {
        userId: req.userId!,
        planId,
        type,
        title: `${typeLabels[type] || type} - ${plan.subject}`,
        content: parsedContent,
      },
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Generate material error:', error);
    res.status(500).json({ error: 'Erro ao gerar material' });
  }
});

// List user's materials
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const planId = req.query.planId as string | undefined;
    const where: any = { userId: req.userId as string };
    if (type) where.type = type;
    if (planId) where.planId = planId;

    const materials = await prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { plan: { select: { title: true, subject: true } } },
    });

    res.json(materials);
  } catch (error) {
    console.error('List materials error:', error);
    res.status(500).json({ error: 'Erro ao listar materiais' });
  }
});

// Update material (inline edit)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const id = req.params.id as string;
    const material = await prisma.material.updateMany({
      where: { id, userId: req.userId as string },
      data: { ...(title && { title }), ...(content && { content }) },
    });

    if (material.count === 0) return res.status(404).json({ error: 'Material não encontrado' });

    const updated = await prisma.material.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Erro ao atualizar material' });
  }
});

// Delete material
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const material = await prisma.material.deleteMany({
      where: { id, userId: req.userId as string },
    });

    if (material.count === 0) return res.status(404).json({ error: 'Material não encontrado' });
    res.json({ message: 'Material excluído' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Erro ao excluir material' });
  }
});

export default router;
