const state = {
  usuario: null,
  config: null,
  cards: [],
  avisos: [],
  aniversariantes: [],
  favoritos: [],
  meta: null,
  admin: {
    aba: 'configuracoes',
    config: [],
    categorias: [],
    grupos: [],
    filtros: {
      categorias: 'todos',
      grupos: 'todos'
    },
    editando: {
      categorias: '',
      grupos: ''
    },
    loading: false,
    message: ''
  },
  temaAtual: 'claro'
};

document.addEventListener('DOMContentLoaded', iniciarApp);

async function iniciarApp() {
  try {
    renderLoading();

    const response = await chamarApi('getInitialData');

    if (!response.ok) {
      renderErro(response.message || response.error?.message || 'Acesso não autorizado.');
      return;
    }

    state.usuario = response.data.usuario;
    state.config = response.data.config;
    state.cards = response.data.cards || [];
    state.avisos = response.data.avisos || [];
    state.aniversariantes = response.data.aniversariantes || [];
    state.favoritos = response.data.favoritos || [];
    state.meta = response.data.meta || null;

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

  document.documentElement.style.setProperty('--cor-principal', state.config.cor_principal || '#0B3A66');
  document.documentElement.style.setProperty('--cor-secundaria', state.config.cor_secundaria || '#123C69');
  document.documentElement.style.setProperty('--cor-destaque', state.config.cor_destaque || '#16A34A');

  document.title = state.config.nome_sistema || 'PAINEL TRANSMARES';
}

function definirTemaInicial() {
  const temaApi = state.meta?.modo_visual_efetivo;
  const preferenciaUsuario = state.usuario?.preferencia_modo_visual;
  const padraoSistema = state.config?.modo_visual_padrao || 'claro';

  state.temaAtual = temaApi || preferenciaUsuario || padraoSistema || 'claro';

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
          <button class="theme-btn icon-only" onclick="alternarTema()" title="${state.temaAtual === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'}" aria-label="${state.temaAtual === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'}">
            ${state.temaAtual === 'escuro' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <section class="info-grid">
        <div class="info-card">
          <div class="info-card-header">
            <span class="info-icon">📢</span>
            <h2>Avisos internos</h2>
          </div>
          ${renderAvisos()}
        </div>

        <div class="info-card">
          <div class="info-card-header">
            <span class="info-icon">🎂</span>
            <h2>Aniversariantes</h2>
          </div>
          ${renderAniversariantes()}
        </div>
      </section>

      <section class="quick-links-strip">
        <div class="quick-links-title">
          <span>⭐</span>
          <strong>Links rápidos</strong>
        </div>

        <div class="quick-links-list">
          ${renderFavoritos()}
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

function renderAvisos() {
  if (!state.avisos.length) {
    return '<p>Nenhum aviso ativo no momento.</p>';
  }

  return state.avisos.map(aviso => `
    <p><strong>${escapeHtml(aviso.titulo || 'Aviso')}</strong><br>${escapeHtml(aviso.mensagem || '')}</p>
  `).join('');
}

function renderAniversariantes() {
  if (!state.aniversariantes.length) {
    return '<p>Nenhum aniversariante nos próximos dias.</p>';
  }

  return state.aniversariantes.map(item => {
    const diasAte = Number(item.dias_ate);
    const quando = Number.isFinite(diasAte)
      ? ` · ${diasAte === 0 ? 'hoje' : `em ${diasAte} dia${diasAte === 1 ? '' : 's'}`}`
      : '';

    return `
      <p><strong>${escapeHtml(item.nome || '')}</strong> ${escapeHtml(item.data || '')}${escapeHtml(quando)}</p>
    `;
  }).join('');
}

function renderFavoritos() {
  if (!state.favoritos.length) {
    return '<span class="quick-link-empty">Nenhum favorito cadastrado.</span>';
  }

  return state.favoritos.map(link => `
    <button class="quick-link-pill" type="button" onclick="abrirLink('${escapeAttr(link.url || '')}')">
      ${escapeHtml(link.titulo || 'Link')}
    </button>
  `).join('');
}

function abrirModulo(id) {
  if (id === 'administracao') {
    abrirAdministracao();
    return;
  }

  alert(`Módulo ainda não implementado: ${id}`);
}

async function abrirAdministracao(preservarMensagem = false) {
  if (state.usuario?.perfil !== 'gestor') {
    renderErro('Acesso permitido apenas para gestor.');
    return;
  }

  state.admin.loading = true;
  if (!preservarMensagem) {
    state.admin.message = '';
  }
  renderAdministracao();

  try {
    const response = await chamarApi('getAdminData');

    if (!response.ok) {
      throw new Error(response.message || response.error?.message || 'Não foi possível carregar a administração.');
    }

    state.admin.config = response.data.config || [];
    state.admin.loading = false;
    renderAdministracao();
  } catch (erro) {
    state.admin.loading = false;
    state.admin.message = erro.message || 'Erro ao carregar a administração.';
    renderAdministracao();
  }
}

function renderAdministracao() {
  const nomeSistema = state.config?.nome_sistema || 'PAINEL TRANSMARES';

  document.getElementById('app').innerHTML = `
    <main class="dashboard">
      <header class="topbar">
        <div class="brand">
          <h1>${escapeHtml(nomeSistema)}</h1>
          <p>Administração</p>
        </div>

        <div class="admin-actions">
          <button class="secondary-btn" type="button" onclick="renderDashboard()">Voltar</button>
        </div>
      </header>

      <section class="admin-shell">
        <div class="admin-tabs">
          <button class="admin-tab ${state.admin.aba === 'configuracoes' ? 'active' : ''}" type="button" onclick="selecionarAbaAdmin('configuracoes')">Configurações</button>
          <button class="admin-tab ${state.admin.aba === 'categorias' ? 'active' : ''}" type="button" onclick="selecionarAbaAdmin('categorias')">Categorias</button>
          <button class="admin-tab ${state.admin.aba === 'grupos' ? 'active' : ''}" type="button" onclick="selecionarAbaAdmin('grupos')">Grupos</button>
        </div>

        ${renderAdminPanel()}
      </section>
    </main>
  `;
}

function renderAdminPanel() {
  if (state.admin.aba === 'categorias') {
    return renderCrudAdmin('categorias', 'Categorias', 'Organize os futuros itens do HUB por categorias.');
  }

  if (state.admin.aba === 'grupos') {
    return renderCrudAdmin('grupos', 'Grupos', 'Organize permissões e agrupamentos para fases futuras.');
  }

  return `
    <section class="admin-panel">
      <div class="admin-panel-header">
        <div>
          <h2>Configurações do Sistema</h2>
          <p>Edite uma configuração por vez.</p>
        </div>

        <button class="secondary-btn" type="button" onclick="restaurarCoresPadrao()">Restaurar cores padrão</button>
      </div>

      ${state.admin.message ? `<p class="admin-message">${escapeHtml(state.admin.message)}</p>` : ''}
      ${state.admin.loading ? '<p class="quick-link-empty">Carregando configurações...</p>' : renderConfigAdmin()}
    </section>
  `;
}

async function selecionarAbaAdmin(aba) {
  state.admin.aba = aba;
  state.admin.message = '';

  if (aba === 'categorias' || aba === 'grupos') {
    await carregarRegistrosAdmin(aba);
    return;
  }

  renderAdministracao();
}

function renderConfigAdmin() {
  if (!state.admin.config.length) {
    return '<p class="quick-link-empty">Nenhuma configuração encontrada.</p>';
  }

  const grupos = agruparConfiguracoes(state.admin.config);

  return `
    <div class="config-groups">
      ${grupos.map(grupo => `
        <section class="config-group">
          <div class="config-group-header">
            <h3>${escapeHtml(grupo.titulo)}</h3>
          </div>
          <div class="config-list">
            ${grupo.itens.map(item => renderConfigItem(item)).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}

function renderConfigItem(item) {
  const inputId = `config_${escapeAttr(item.chave)}`;
  const disabled = item.editavel === false ? 'disabled' : '';
  const input = renderConfigInput(item, inputId, disabled);

  return `
    <article class="config-row">
      <div class="config-info">
        <strong>${escapeHtml(obterRotuloConfig(item.chave))}</strong>
        <span>${escapeHtml(item.descricao || '')}</span>
      </div>

      <div class="config-control">
        ${input}
        <button class="save-btn" type="button" onclick="salvarConfigAdmin('${escapeAttr(item.chave)}')" ${disabled}>Salvar</button>
      </div>
    </article>
  `;
}

function agruparConfiguracoes(configs) {
  const definicoes = [
    {
      id: 'identidade',
      titulo: 'Identidade',
      chaves: ['nome_sistema', 'subtitulo_sistema']
    },
    {
      id: 'visual',
      titulo: 'Visual',
      chaves: ['cor_principal', 'cor_secundaria', 'cor_destaque', 'modo_visual_padrao']
    },
    {
      id: 'logo',
      titulo: 'Logo e Arquivos',
      chaves: ['exibir_logo', 'logo_file_id', 'logo_url', 'drive_folder_name', 'drive_folder_id']
    },
    {
      id: 'limites',
      titulo: 'Limites do Painel',
      chaves: ['limite_favoritos', 'limite_avisos', 'janela_aniversarios_dias', 'limite_aniversariantes', 'retencao_historico_meses']
    }
  ];
  const porChave = configs.reduce((acc, item) => {
    acc[item.chave] = item;
    return acc;
  }, {});

  return definicoes.map(grupo => ({
    ...grupo,
    itens: grupo.chaves.map(chave => porChave[chave]).filter(Boolean)
  })).filter(grupo => grupo.itens.length);
}

function obterRotuloConfig(chave) {
  const rotulos = {
    nome_sistema: 'Nome do sistema',
    subtitulo_sistema: 'Subtítulo',
    cor_principal: 'Cor principal',
    cor_secundaria: 'Cor secundária',
    cor_destaque: 'Cor de destaque',
    modo_visual_padrao: 'Modo visual padrão',
    exibir_logo: 'Exibir logo',
    logo_file_id: 'Arquivo da logo',
    logo_url: 'URL da logo',
    drive_folder_id: 'Pasta do Drive',
    drive_folder_name: 'Nome da pasta',
    limite_favoritos: 'Links rápidos',
    retencao_historico_meses: 'Retenção do histórico',
    janela_aniversarios_dias: 'Janela de aniversários',
    limite_aniversariantes: 'Máximo de aniversariantes',
    limite_avisos: 'Máximo de avisos'
  };

  return rotulos[chave] || chave;
}

function renderCrudAdmin(entidade, titulo, subtitulo) {
  const records = state.admin[entidade] || [];
  const resumo = obterResumoRegistros(records);

  return `
    <section class="admin-panel">
      <div class="admin-panel-header">
        <div>
          <h2>${escapeHtml(titulo)}</h2>
          <p>${escapeHtml(subtitulo)} ${resumo.total} registros · ${resumo.ativos} ativos · ${resumo.inativos} inativos</p>
        </div>
      </div>

      ${state.admin.message ? `<p class="admin-message">${escapeHtml(state.admin.message)}</p>` : ''}

      <div class="crud-filters" role="group" aria-label="Filtro de status">
        ${renderFiltroAdmin(entidade, 'todos', 'Todos')}
        ${renderFiltroAdmin(entidade, 'ativo', 'Ativos')}
        ${renderFiltroAdmin(entidade, 'inativo', 'Inativos')}
      </div>

      <section class="crud-create">
        <strong class="crud-create-title">Adicionar novo</strong>
        <input id="${entidade}_novo_nome" class="config-input" type="text" placeholder="Nome">
        <input id="${entidade}_novo_descricao" class="config-input" type="text" placeholder="Descrição">
        <select id="${entidade}_novo_status" class="config-input">
          <option value="ativo">ativo</option>
          <option value="inativo">inativo</option>
        </select>
        <button class="save-btn" type="button" onclick="salvarRegistroAdmin('${entidade}', '')">Adicionar</button>
      </section>

      ${state.admin.loading ? '<p class="quick-link-empty">Carregando registros...</p>' : renderRegistrosAdmin(entidade, records)}
    </section>
  `;
}

function renderRegistrosAdmin(entidade, records) {
  const filtrados = filtrarRegistrosAdmin(entidade, records);

  if (!filtrados.length) {
    return '<p class="quick-link-empty">Nenhum registro cadastrado.</p>';
  }

  return `
    <div class="crud-list">
      <div class="crud-header">
        <span>Nome</span>
        <span>Descrição</span>
        <span>Status</span>
        <span>Ação</span>
      </div>
      ${filtrados.map(record => renderRegistroAdmin(entidade, record)).join('')}
    </div>
  `;
}

function renderRegistroAdmin(entidade, record) {
  const id = escapeAttr(record.id || '');
  const prefixo = `${entidade}_${id}`;
  const editando = state.admin.editando[entidade] === record.id;
  const disabled = editando ? '' : 'disabled';

  return `
    <article class="crud-row ${editando ? 'editing' : ''}">
      <input id="${prefixo}_nome" class="config-input" type="text" value="${escapeAttr(record.nome || '')}" placeholder="Nome" ${disabled}>
      <input id="${prefixo}_descricao" class="config-input" type="text" value="${escapeAttr(record.descricao || '')}" placeholder="Descrição" ${disabled}>
      <select id="${prefixo}_status" class="config-input status-${escapeAttr(record.status || 'inativo')}" ${disabled}>
        <option value="ativo" ${record.status === 'ativo' ? 'selected' : ''}>ativo</option>
        <option value="inativo" ${record.status === 'inativo' ? 'selected' : ''}>inativo</option>
      </select>
      <div class="crud-actions">
        ${editando
          ? `<button class="save-btn" type="button" onclick="salvarRegistroAdmin('${entidade}', '${id}')">Salvar</button>`
          : `<button class="icon-btn" type="button" onclick="editarRegistroAdmin('${entidade}', '${id}')" title="Editar" aria-label="Editar ${escapeAttr(record.nome || 'registro')}">✎</button>`
        }
      </div>
    </article>
  `;
}

function renderFiltroAdmin(entidade, filtro, label) {
  const ativo = state.admin.filtros[entidade] === filtro;

  return `
    <button class="filter-btn ${ativo ? 'active' : ''}" type="button" onclick="filtrarAdmin('${entidade}', '${filtro}')">
      ${escapeHtml(label)}
    </button>
  `;
}

function obterResumoRegistros(records) {
  return records.reduce((acc, record) => {
    acc.total += 1;

    if (record.status === 'ativo') {
      acc.ativos += 1;
    } else {
      acc.inativos += 1;
    }

    return acc;
  }, {
    total: 0,
    ativos: 0,
    inativos: 0
  });
}

function filtrarRegistrosAdmin(entidade, records) {
  const filtro = state.admin.filtros[entidade] || 'todos';

  if (filtro === 'todos') {
    return records;
  }

  return records.filter(record => record.status === filtro);
}

function filtrarAdmin(entidade, filtro) {
  state.admin.filtros[entidade] = filtro;
  state.admin.editando[entidade] = '';
  renderAdministracao();
}

function editarRegistroAdmin(entidade, id) {
  state.admin.editando[entidade] = id;
  renderAdministracao();
}

async function carregarRegistrosAdmin(entidade) {
  state.admin.loading = true;
  renderAdministracao();

  try {
    const response = await chamarApi('listAdminRecords', {
      entidade
    });

    if (!response.ok) {
      throw new Error(response.message || response.error?.message || 'Não foi possível carregar registros.');
    }

    state.admin[entidade] = response.data.records || [];
    state.admin.editando[entidade] = '';
    state.admin.loading = false;
    renderAdministracao();
  } catch (erro) {
    state.admin.loading = false;
    state.admin.message = erro.message || 'Erro ao carregar registros.';
    renderAdministracao();
  }
}

async function salvarRegistroAdmin(entidade, id) {
  const prefixo = id ? `${entidade}_${id}` : `${entidade}_novo`;
  const nome = document.getElementById(`${prefixo}_nome`)?.value || '';
  const descricao = document.getElementById(`${prefixo}_descricao`)?.value || '';
  const status = document.getElementById(`${prefixo}_status`)?.value || 'ativo';

  try {
    const response = await chamarApi('saveAdminRecord', {
      entidade,
      id,
      nome,
      descricao,
      status
    });

    if (!response.ok) {
      throw new Error(response.message || response.error?.message || 'Não foi possível salvar.');
    }

    state.admin.message = 'Registro salvo.';
    state.admin.editando[entidade] = '';
    await carregarRegistrosAdmin(entidade);
  } catch (erro) {
    state.admin.message = erro.message || 'Erro ao salvar registro.';
    renderAdministracao();
  }
}

function renderConfigInput(item, inputId, disabled) {
  const valor = escapeAttr(item.valor || '');

  if (item.tipo === 'cor') {
    return `
      <input id="${inputId}" class="config-input color-input" type="color" value="${valor || '#000000'}" ${disabled}>
    `;
  }

  if (item.tipo === 'numero') {
    return `<input id="${inputId}" class="config-input" type="number" min="0" step="1" value="${valor}" ${disabled}>`;
  }

  if (item.tipo === 'booleano') {
    return `
      <select id="${inputId}" class="config-input" ${disabled}>
        <option value="sim" ${item.valor === 'sim' ? 'selected' : ''}>sim</option>
        <option value="nao" ${item.valor === 'nao' ? 'selected' : ''}>nao</option>
      </select>
    `;
  }

  if (item.chave === 'modo_visual_padrao') {
    return `
      <select id="${inputId}" class="config-input" ${disabled}>
        <option value="claro" ${item.valor === 'claro' ? 'selected' : ''}>claro</option>
        <option value="escuro" ${item.valor === 'escuro' ? 'selected' : ''}>escuro</option>
      </select>
    `;
  }

  return `<input id="${inputId}" class="config-input" type="text" value="${valor}" ${disabled}>`;
}

async function salvarConfigAdmin(chave) {
  const input = document.getElementById(`config_${chave}`);

  if (!input) return;

  try {
    const response = await chamarApi('saveConfig', {
      chave,
      valor: input.value
    });

    if (!response.ok) {
      throw new Error(response.message || response.error?.message || 'Não foi possível salvar.');
    }

    state.config = response.data.config || state.config;
    aplicarConfigVisual();
    state.admin.message = 'Configuração salva.';
    await abrirAdministracao(true);
  } catch (erro) {
    state.admin.message = erro.message || 'Erro ao salvar configuração.';
    renderAdministracao();
  }
}

async function restaurarCoresPadrao() {
  try {
    const response = await chamarApi('restoreDefaultColors');

    if (!response.ok) {
      throw new Error(response.message || response.error?.message || 'Não foi possível restaurar as cores.');
    }

    state.config = response.data.config || state.config;
    aplicarConfigVisual();
    state.admin.message = 'Cores padrão restauradas.';
    await abrirAdministracao(true);
  } catch (erro) {
    state.admin.message = erro.message || 'Erro ao restaurar cores.';
    renderAdministracao();
  }
}

function abrirLink(url) {
  if (!url) return;
  window.open(url, '_blank', 'noopener');
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
