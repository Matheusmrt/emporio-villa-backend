
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import pedidoRoutes from './routes/pedidos.js';
import relatorioRoutes from './routes/relatorios.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/relatorios', relatorioRoutes);

app.get('/', (req, res) => {
  res.send('API Empório Villa Borghese rodando com SQLite!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
