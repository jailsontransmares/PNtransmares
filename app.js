const state = {
  usuario: null,
  config: null,
  cards: [],
  temaAtual: 'claro'
};

document.addEventListener('DOMContentLoaded', iniciarApp);

async function iniciarApp() {
  try {
    renderLoading();

    const response = await chamarApi('getInitialData');

    if (!response.ok) {
      renderErro(response.message || 'Acesso não autorizado.');
      return;
    }

    state.usuario = response.data.usuario;
    state.config = response.data.config;
    state.cards = response.data.cards || [];

    aplicarConfigVisual();
    definirTemaInicial();
    renderDashboard();

  } catch (erro) {
    renderErro(erro.message || 'Erro ao carregar o sistema.');
  }
}

function renderLoading() {
  document.getElementById('app').innerHTML = `
    <section class="loading-card">
      <h1>PAINEL TRANSMARES</h1>
      <p>Carregando sistema...</p>
    </section>
  `;
}

function renderErro(mensagem) {
  document.getElementById('app').innerHTML = `
    <section class="error-card">
      <h1>Acesso não autorizado</h1>
      <p>${escapeHtml(mensagem)}</p>
    </section>
  `;
}

function aplicarConfigVisual() {
  if (!state.config) return;

  document.documentElement.style.setProperty('--cor-principal', state.config.cor_principal || '#0F4C81');
  document.documentElement.style.setProperty('--cor-secundaria', state.config.cor_secundaria || '#1F2937');
  document.documentElement.style.setProperty('--cor-destaque', state.config.cor_destaque || '#16A34A');

  document.title = state.config.nome_sistema || 'PAINEL TRANSMARES';
}

function definirTemaInicial() {
  const preferenciaUsuario = state.usuario?.preferencia_modo_visual;
  const padraoSistema = state.config?.modo_visual_padrao || 'claro';

  state.temaAtual = preferenciaUsuario || padraoSistema || 'claro';

  aplicarTema();
}

function aplicarTema() {
  if (state.temaAtual === 'escuro') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

function alternarTema() {
  state.temaAtual = state.temaAtual === 'escuro' ? 'claro' : 'escuro';
  aplicarTema();

  chamarApi('saveUserTheme', {
    modo: state.temaAtual
  }).catch(() => {
    console.warn('Não foi possível salvar a preferência de tema.');
  });

  renderDashboard();
}

function renderDashboard() {
  const nomeSistema = state.config?.nome_sistema || 'PAINEL TRANSMARES';
  const subtitulo = state.config?.subtitulo_sistema || 'Central operacional da Transmares Corretora de Seguros';

  document.getElementById('app').innerHTML = `
    <main class="dashboard">
      <header class="topbar">
        <div class="brand">
          <h1>${escapeHtml(nomeSistema)}</h1>
          <p>${escapeHtml(subtitulo)}</p>
        </div>

        <div class="user-box">
          <strong>${escapeHtml(state.usuario.nome || '')}</strong><br>
          ${escapeHtml(state.usuario.email || '')}<br>
          Perfil: ${escapeHtml(state.usuario.perfil || '')}

          <br>
          <button class="theme-btn" onclick="alternarTema()">
            ${state.temaAtual === 'escuro' ? '☀️ Modo claro' : '🌙 Modo escuro'}
          </button>
        </div>
      </header>

      <section class="info-grid">
  <div class="info-card">
    <div class="info-card-header">
      <span class="info-icon">📢</span>
      <h2>Avisos internos</h2>
    </div>
    <p>Nenhum aviso ativo no momento.</p>
  </div>

  <div class="info-card">
    <div class="info-card-header">
      <span class="info-icon">🎂</span>
      <h2>Aniversariantes</h2>
    </div>
    <p>Nenhum aniversariante nos próximos dias.</p>
  </div>
</section>

<section class="quick-links-strip">
  <div class="quick-links-title">
    <span>⭐</span>
    <strong>Links rápidos</strong>
  </div>

  <div class="quick-links-list">
    <span class="quick-link-empty">Nenhum favorito cadastrado.</span>
  </div>
</section>

<div class="section-title">
  <h2>Módulos</h2>
  <p>Acesse as principais áreas operacionais do painel.</p>
</div>

<section class="module-grid">
        ${state.cards.map(card => `
          <article class="module-card" onclick="abrirModulo('${escapeAttr(card.id)}')">
            <h3>${escapeHtml(card.titulo)}</h3>
            <p>${escapeHtml(card.descricao || '')}</p>
            <span class="badge">Acessar</span>
          </article>
        `).join('')}
      </section>
    </main>
  `;
}

function abrirModulo(id) {
  alert(`Módulo ainda não implementado: ${id}`);
}

function escapeHtml(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(texto) {
  return escapeHtml(texto).replace(/`/g, '&#096;');
}