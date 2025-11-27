const API_BASE = 'http://localhost:3000/api/agendamento';

const el = {
  form: document.getElementById('agendamento-form'),
  patient_name: document.getElementById('patient_name'),
  service: document.getElementById('service'),
  date: document.getElementById('date'),
  status: document.getElementById('status'),
  tbody: document.getElementById('agendamento-body')
};

// Buscar todas as consultas
async function fetchAgendamento() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  renderAgendamento(data);
}

// Renderizar tabela
function renderAgendamento(agendamento) {
  el.tbody.innerHTML = '';
  for (const a of agendamento) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id}</td>
      <td><input type="text" value="${a.patient_name}" data-id="${a.id}" class="name-input" /></td>
      <td><input type="text" value="${a.service}" data-id="${a.id}" class="service-input" /></td>
      <td><input type="datetime-local" value="${formatDate(a.date)}" data-id="${a.id}" class="date-input" /></td>
      <td>
        <select data-id="${a.id}" class="status-select">
          <option value="agendada" ${a.status === 'agendada' ? 'selected' : ''}>Agendada</option>
          <option value="concluída" ${a.status === 'concluída' ? 'selected' : ''}>Concluída</option>
          <option value="cancelada" ${a.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      </td>
      <td>
        <button data-id="${a.id}" class="save-btn">Salvar</button>
        <button data-id="${a.id}" class="delete-btn">Excluir</button>
      </td>
    `;
    el.tbody.appendChild(tr);
  }
  bindRowEvents();
}

// Eventos da tabela
function bindRowEvents() {
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const patient_name = document.querySelector(`.name-input[data-id="${id}"]`).value;
      const service = document.querySelector(`.service-input[data-id="${id}"]`).value;
      const date = document.querySelector(`.date-input[data-id="${id}"]`).value;
      const status = document.querySelector(`.status-select[data-id="${id}"]`).value;

      await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_name, service, date, status })
      });
      fetchAgendamento();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Deseja excluir esta consulta?')) return;
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      fetchAgendamento();
    });
  });
}

// Adicionar nova consulta
el.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const patient_name = el.patient_name.value.trim();
  const service = el.service.value.trim();
  const date = el.date.value;
  const status = el.status.value;

  if (!patient_name || !service || !date) {
    return alert('Preencha todos os campos obrigatórios.');
  }

  await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_name, service, date, status })
  });

  el.patient_name.value = '';
  el.service.value = '';
  el.date.value = '';
  el.status.value = 'agendada';

  fetchAgendamento();
});

// Formatar data para datetime-local
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Inicial
fetchAgendamento();
