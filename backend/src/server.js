require('dotenv').config();
const express = require('express');
const cors = require('cors');
const agendamentoRouter = require('./routes/agendamento');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/agendamento', agendamentoRouter);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

