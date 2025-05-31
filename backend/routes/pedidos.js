import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

router.post('/', autenticar, async (req, res) => {
  const { dias, quantidade } = req.body;
  try {
    const pedido = await prisma.pedido.create({
      data: {
        userId: req.user.id,
        dias: JSON.stringify(dias),
        quantidade: parseInt(quantidade),
        data: new Date()
      }
    });
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar pedido' });
  }
});

router.get('/', autenticar, async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { userId: req.user.id },
      include: { user: true },
      orderBy: { data: 'desc' }
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
});

export default router;