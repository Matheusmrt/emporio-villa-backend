import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

function autenticarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.admin) return res.status(403).json({ erro: 'Acesso negado' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

router.get('/', autenticarAdmin, async (req, res) => {
  const { data } = req.query;
  try {
    const filtros = data ? {
      data: {
        gte: new Date(`${data}T00:00:00.000Z`),
        lte: new Date(`${data}T23:59:59.999Z`)
      }
    } : {};
    const pedidos = await prisma.pedido.findMany({
      where: filtros,
      include: { user: true },
      orderBy: { data: 'desc' }
    });
    const relatorio = pedidos.map(p => ({
      data: p.data.toISOString().split('T')[0],
      nome: p.user.nome,
      quantidade: p.quantidade
    }));
    res.json(relatorio);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
});

export default router;