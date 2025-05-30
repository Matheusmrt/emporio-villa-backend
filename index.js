
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro MongoDB", err));

app.get("/", (req, res) => res.send("API Empório Villa Borghese funcionando"));

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
