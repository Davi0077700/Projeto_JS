const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todas
router.get('/', async (req, res) => {
  try {
    const rows = await db('agendamento').select('*').orderBy('date', 'asc');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar consultas.' });
  }
});

// Buscar por id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const agendamento = await db('agendamento').where({ id }).first();
  if (!agendamento) return res.status(404).json({ message: 'Consulta não encontrada.' });
  res.json(agendamento);
});

// Criar
router.post('/', async (req, res) => {
  const { patient_name, service, date, status = 'agendada' } = req.body;
  if (!patient_name || !service || !date) {
    return res.status(400).json({ message: 'Nome, serviço e data são obrigatórios.' });
  }
  const [id] = await db('agendamento').insert({ patient_name, service, date, status });
  const created = await db('agendamento').where({ id }).first();
  res.status(201).json(created);
});

// Atualizar
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const exists = await db('agendamento').where({ id }).first();
  if (!exists) return res.status(404).json({ message: 'Consulta não encontrada.' });

  const payload = {};
  if (req.body.patient_name !== undefined) payload.patient_name = req.body.patient_name;
  if (req.body.service !== undefined) payload.service = req.body.service;
  if (req.body.date !== undefined) payload.date = req.body.date;
  if (req.body.status !== undefined) payload.status = req.body.status;
  payload.updated_at = db.fn.now();

  await db('agendamento').where({ id }).update(payload);
  const updated = await db('agendamento').where({ id }).first();
  res.json(updated);
});

// Excluir
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const exists = await db('agendamento').where({ id }).first();
  if (!exists) return res.status(404).json({ message: 'Consulta não encontrada.' });
  await db('agendamento').where({ id }).del();
  res.status(204).send();
});

module.exports = router;
