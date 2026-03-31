import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { chat, ChatMessage } from '../services/ai';

const router = Router();
const prisma = new PrismaClient();

// Conversational AI chat for lesson plan creation
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { messages, planId } = req.body as { messages: ChatMessage[]; planId?: string };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mensagens são obrigatórias' });
    }

    const aiResponse = await chat(messages);

    // If planId provided, update conversation history
    if (planId) {
      await prisma.lessonPlan.update({
        where: { id: planId, userId: req.userId as string },
        data: {
          conversation: [...messages, { role: 'assistant', content: aiResponse }],
        },
      });
    }

    // Check if AI generated a structured plan
    const planMatch = aiResponse.match(/<plan>([\s\S]*?)<\/plan>/);
    let generatedPlan = null;
    if (planMatch) {
      try {
        generatedPlan = JSON.parse(planMatch[1]);
      } catch {
        // Plan parsing failed, just return the text
      }
    }

    res.json({
      message: aiResponse,
      generatedPlan,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

// Create a new lesson plan
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, level, objectives, studentProfile, conversation, preClass, inClass, assessment, status } = req.body;

    const plan = await prisma.lessonPlan.create({
      data: {
        userId: req.userId!,
        title: title || 'Novo Plano',
        subject: subject || '',
        level: level || '',
        objectives: objectives || '',
        studentProfile,
        conversation: conversation || [],
        preClass,
        inClass,
        assessment,
        status: status || 'draft',
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
});

// List user's plans
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const uid = req.userId as string;
    const where: any = { userId: uid };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const plans = await prisma.lessonPlan.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        subject: true,
        level: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(plans);
  } catch (error) {
    console.error('List plans error:', error);
    res.status(500).json({ error: 'Erro ao listar planos' });
  }
});

// Get single plan
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const plan = await prisma.lessonPlan.findFirst({
      where: { id, userId: req.userId as string },
      include: { materials: true, reflections: true },
    });

    if (!plan) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Erro ao buscar plano' });
  }
});

// Update plan
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const plan = await prisma.lessonPlan.updateMany({
      where: { id, userId: req.userId as string },
      data: req.body,
    });

    if (plan.count === 0) return res.status(404).json({ error: 'Plano não encontrado' });

    const updated = await prisma.lessonPlan.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
});

// Delete plan
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const plan = await prisma.lessonPlan.deleteMany({
      where: { id, userId: req.userId as string },
    });

    if (plan.count === 0) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json({ message: 'Plano excluído' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Erro ao excluir plano' });
  }
});

export default router;
