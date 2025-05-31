import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

router.post('/register', async (req, res) => {
  const { nome, setor, email, senha } = req.body;
  try {
    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ erro: 'Email já cadastrado' });
    const hash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: { nome, setor, email, senha: hash }
    });
    res.status(201).json({ mensagem: 'Usuário criado', user });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(401).json({ erro: 'Senha inválida' });
    const token = jwt.sign({ id: user.id, admin: user.admin }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login' });
  }
});

export default router;