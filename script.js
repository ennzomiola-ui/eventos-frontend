// Troque pela URL pública do seu serviço no Render (sem barra no final)
const API_URL = 'https://eventos-backend-gy7a.onrender.com';

const lista = document.getElementById('lista');
const form = document.getElementById('form-evento');
const mensagem = document.getElementById('mensagem');

function mostrar(texto, classe) {
  mensagem.textContent = texto;
  mensagem.className = classe;
}

async function carregarEventos() {
  try {
    const resp = await fetch(`${API_URL}/eventos`);
    if (!resp.ok) throw new Error();
    const eventos = await resp.json();
    lista.textContent = '';
    if (eventos.length === 0) {
      lista.textContent = 'Nenhum evento cadastrado.';
      return;
    }
    eventos.forEach(e => {
      const div = document.createElement('div');
      div.className = 'evento';
      const h3 = document.createElement('h3');
      h3.textContent = e.titulo;
      const desc = document.createElement('p');
      desc.textContent = e.descricao || '';
      const info = document.createElement('p');
      info.textContent = `📅 ${e.data_evento}  |  📍 ${e.local}`;
      div.append(h3, desc, info);
      lista.appendChild(div);
    });
  } catch {
    lista.textContent = 'Erro ao carregar eventos. (Se o Render estiver "dormindo", aguarde ~1 min e recarregue.)';
  }
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const [ano, mes, dia] = document.getElementById('data').value.split('-');
  const evento = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    data_evento: `${dia}/${mes}/${ano}`,
    local: document.getElementById('local').value.trim()
  };
  try {
    const resp = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    });
    const dados = await resp.json();
    if (!resp.ok) throw new Error(dados.erro || 'Erro ao cadastrar.');
    mostrar('Evento cadastrado com sucesso!', 'ok');
    form.reset();
    carregarEventos();
  } catch (err) {
    mostrar(err.message, 'erro');
  }
});

carregarEventos();
