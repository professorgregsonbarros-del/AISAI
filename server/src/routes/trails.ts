import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

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

// ADMIN: Create trail content
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, context, duration, order } = req.body;
    if (!title || !body || !context || !duration || order === undefined) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    const trail = await prisma.trailContent.create({
      data: { title, body, context, duration, order: Number(order) },
    });
    res.status(201).json(trail);
  } catch (error) {
    console.error('Create trail error:', error);
    res.status(500).json({ error: 'Erro ao criar trilha' });
  }
});

// ADMIN: Update trail content
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, context, duration, order } = req.body;
    const id = req.params.id as string;
    const trail = await prisma.trailContent.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(body && { body }),
        ...(context && { context }),
        ...(duration && { duration }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });
    res.json(trail);
  } catch (error) {
    console.error('Update trail error:', error);
    res.status(500).json({ error: 'Erro ao atualizar trilha' });
  }
});

// ADMIN: Delete trail content
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.trailContent.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Trilha excluída' });
  } catch (error) {
    console.error('Delete trail error:', error);
    res.status(500).json({ error: 'Erro ao excluir trilha' });
  }
});

// ADMIN: List all users
router.get('/admin/users', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, institution: true, role: true, isAdmin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// ADMIN: List all plans (platform analytics)
router.get('/admin/plans', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.lessonPlan.findMany({
      select: {
        id: true, title: true, subject: true, level: true, status: true,
        createdAt: true, updatedAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar planos' });
  }
});

export default router;
