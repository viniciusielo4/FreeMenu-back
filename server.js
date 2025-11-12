// backend/server.js
import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota para enviar mensagens
app.post("/mensagens", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO mensagens (nome, email, mensagem) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, mensagem]
    );
    res.status(201).json({ message: "Mensagem salva!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar mensagem no banco." });
  }
});

// Rota para listar mensagens (opcional)
app.get("/mensagens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mensagens ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar mensagens." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
    