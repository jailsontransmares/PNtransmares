const SPREADSHEET_ID = '1B_TFdiX-l7vX0gU0EX53l3-RhxA-OanKsTOaMd5qATw';

const SHEET_HEADERS = {
  Usuarios: [
    'id_usuario',
    'nome',
    'email',
    'perfil',
    'status',
    'gestor_principal',
    'preferencia_modo_visual',
    'origem_cadastro',
    'data_cadastro',
    'data_atualizacao'
  ],
  Config: [
    'chave',
    'valor',
    'descricao',
    'tipo',
    'data_atualizacao'
  ],
  Itens: [
    'id_item',
    'tipo',
    'titulo',
    'descricao',
    'url',
    'categoria',
    'grupo',
    'status',
    'criado_por',
    'data_cadastro',
    'data_atualizacao'
  ],
  Categorias: [
    'id_categoria',
    'nome',
    'descricao',
    'status',
    'data_cadastro',
    'data_atualizacao'
  ],
  Grupos: [
    'id_grupo',
    'nome',
    'descricao',
    'status',
    'data_cadastro',
    'data_atualizacao'
  ],
  Chaves_Acesso: [
    'id_chave',
    'tipo',
    'chave',
    'status',
    'usada_por',
    'data_cadastro',
    'data_utilizacao'
  ],
  Historico_Auditoria: [
    'id_evento',
    'data_evento',
    'usuario_email',
    'acao',
    'entidade',
    'detalhes'
  ],
  Parceiros: [
    'id_parceiro',
    'nome',
    'codigo_revendedor',
    'status',
    'data_cadastro',
    'data_atualizacao'
  ],
  Historico_Links: [
    'id_historico',
    'data_geracao',
    'parceiro',
    'produto',
    'link',
    'status'
  ],
  Avisos_Internos: [
    'id_aviso',
    'titulo',
    'mensagem',
    'data_inicio',
    'data_fim',
    'status',
    'criado_por',
    'data_cadastro',
    'data_atualizacao'
  ],
  Aniversarios: [
    'id_aniversario',
    'nome',
    'tipo',
    'data_nascimento',
    'observacao',
    'status',
    'data_cadastro',
    'data_atualizacao'
  ],
  Colaboradores: [
    'id_colaborador',
    'nome',
    'email',
    'telefone',
    'cargo',
    'status',
    'data_cadastro',
    'data_atualizacao'
  ],
  Colaboradores_Registros: [
    'id_registro',
    'id_colaborador',
    'tipo',
    'descricao',
    'data_registro',
    'criado_por',
    'data_cadastro'
  ]
};

const CONFIG_PADRAO = [
  ['nome_sistema', 'PAINEL TRANSMARES', 'Nome exibido no topo do sistema.', 'texto'],
  ['subtitulo_sistema', 'Central operacional da Transmares Corretora de Seguros', 'Subtítulo exibido no topo do sistema.', 'texto'],
  ['cor_principal', '#0B3A66', 'Cor principal da interface.', 'cor'],
  ['cor_secundaria', '#123C69', 'Cor secundária da interface.', 'cor'],
  ['cor_destaque', '#16A34A', 'Cor de destaque da interface.', 'cor'],
  ['modo_visual_padrao', 'claro', 'Modo visual padrão para usuários sem preferência.', 'lista'],
  ['exibir_logo', 'nao', 'Define se a logo deve ser exibida no topo.', 'booleano'],
  ['logo_file_id', '', 'ID do arquivo de logo no Google Drive.', 'texto'],
  ['logo_url', '', 'URL pública ou interna da logo.', 'texto'],
  ['drive_folder_id', '', 'ID da pasta do sistema no Google Drive.', 'texto'],
  ['drive_folder_name', 'PAINEL TRANSMARES — Arquivos do Sistema', 'Nome da pasta do sistema no Google Drive.', 'texto'],
  ['limite_favoritos', '5', 'Quantidade máxima de links favoritos no painel.', 'numero'],
  ['retencao_historico_meses', '12', 'Tempo de retenção do histórico em meses.', 'numero'],
  ['janela_aniversarios_dias', '15', 'Janela de próximos aniversários em dias.', 'numero'],
  ['limite_aniversariantes', '25', 'Quantidade máxima de aniversariantes exibidos.', 'numero'],
  ['limite_avisos', '3', 'Quantidade máxima de avisos ativos exibidos no painel.', 'numero']
];

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = params.action || 'ping';
  const callback = params.callback || '';
  const payload = parsePayload_(params.payload);

  try {
    let result;

    switch (action) {
      case 'ping':
        result = ping();
        break;
      case 'whoami':
        result = whoami();
        break;
      case 'getInitialData':
        result = getInitialData();
        break;
      case 'saveUserTheme':
        result = saveUserTheme(payload);
        break;
      case 'garantirAbasBase':
        exigirGestor_();
        result = garantirAbasBase();
        break;
      case 'garantirConfigPadrao':
        exigirGestor_();
        result = garantirConfigPadrao();
        break;
      case 'garantirPastaSistemaDrive':
        exigirGestor_();
        result = garantirPastaSistemaDrive();
        break;
      case 'diagnosticoFase1':
        exigirGestor_();
        result = diagnosticoFase1();
        break;
      case 'getAdminData':
        exigirGestor_();
        result = getAdminData();
        break;
      case 'saveConfig':
        exigirGestor_();
        result = saveConfig(payload);
        break;
      case 'restoreDefaultColors':
        exigirGestor_();
        result = restoreDefaultColors();
        break;
      case 'listAdminRecords':
        exigirGestor_();
        result = listAdminRecords(payload);
        break;
      case 'saveAdminRecord':
        exigirGestor_();
        result = saveAdminRecord(payload);
        break;
      default:
        result = erro_('ACTION_NOT_FOUND', 'Ação não encontrada.', action);
    }

    return respostaJson_(result, callback);
  } catch (error) {
    return respostaJson_(erro_(obterCodigoErro_(error), error.message || 'Erro interno.', action), callback);
  }
}

function ping() {
  return sucesso_('ping', {
    message: 'pong',
    timestamp: new Date().toISOString()
  });
}

function whoami() {
  const email = obterEmailUsuarioAtual_();
  const usuario = buscarUsuarioPorEmail_(email);

  return sucesso_('whoami', {
    email,
    autorizado: Boolean(usuario && normalizar_(usuario.status) === 'ativo'),
    usuario
  });
}

function getInitialData() {
  garantirAbasBase();
  garantirConfigPadrao();
  const config = obterConfig();
  const usuario = obterUsuarioAutorizado_();
  const pasta = garantirPastaSistemaDrive();
  const limites = obterLimitesConfig_(config);
  const modoVisualEfetivo = usuario.preferencia_modo_visual || config.modo_visual_padrao || 'claro';

  return sucesso_('getInitialData', {
    usuario,
    config,
    drive: pasta.data,
    meta: {
      perfil: usuario.perfil,
      modo_visual_efetivo: modoVisualEfetivo,
      limites
    },
    cards: obterCardsPorPerfil_(usuario.perfil),
    avisos: obterAvisosIniciais_(config),
    aniversariantes: obterAniversariantesIniciais_(config),
    favoritos: obterFavoritosIniciais_(usuario, config)
  });
}

function saveUserTheme(payload) {
  garantirAbasBase();

  const modo = normalizar_(payload && payload.modo);

  if (modo !== 'claro' && modo !== 'escuro') {
    return erro_('INVALID_THEME', 'Modo visual inválido.', 'saveUserTheme');
  }

  const usuario = obterUsuarioAutorizado_();
  const sheet = obterPlanilha_().getSheetByName('Usuarios');
  const headers = obterHeaders_(sheet);
  const emailCol = obterIndiceColuna_(headers, 'email');
  const modoCol = obterIndiceColuna_(headers, 'preferencia_modo_visual');
  const atualizadoCol = obterIndiceColuna_(headers, 'data_atualizacao');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (normalizar_(values[i][emailCol]) === normalizar_(usuario.email)) {
      sheet.getRange(i + 1, modoCol + 1).setValue(modo);

      if (atualizadoCol >= 0) {
        sheet.getRange(i + 1, atualizadoCol + 1).setValue(new Date());
      }

      registrarAuditoria_('saveUserTheme', 'Usuarios', JSON.stringify({ modo }));

      return sucesso_('saveUserTheme', {
        modo
      });
    }
  }

  return erro_('USER_NOT_FOUND', 'Usuário não encontrado.', 'saveUserTheme');
}

function getAdminData() {
  garantirConfigPadrao();

  return sucesso_('getAdminData', {
    config: obterConfigDetalhada_()
  });
}

function saveConfig(payload) {
  const chave = String(payload && payload.chave || '').trim();
  const valor = payload && Object.prototype.hasOwnProperty.call(payload, 'valor')
    ? String(payload.valor)
    : '';
  const definicao = obterDefinicaoConfig_(chave);

  if (!definicao) {
    return erro_('CONFIG_NOT_ALLOWED', 'Configuração não permitida.', 'saveConfig');
  }

  const valorValidado = validarValorConfig_(valor, definicao);
  const resultado = salvarConfig(chave, valorValidado);

  registrarAuditoria_('saveConfig', 'Config', JSON.stringify({
    chave,
    valor: valorValidado
  }));

  return sucesso_('saveConfig', {
    chave,
    valor: valorValidado,
    config: obterConfig(),
    resultado: resultado.data
  });
}

function restoreDefaultColors() {
  const cores = ['cor_principal', 'cor_secundaria', 'cor_destaque'];
  const restauradas = {};

  cores.forEach(function(chave) {
    const definicao = obterDefinicaoConfig_(chave);

    salvarConfig(chave, definicao.valor_padrao);
    restauradas[chave] = definicao.valor_padrao;
  });

  registrarAuditoria_('restoreDefaultColors', 'Config', JSON.stringify(restauradas));

  return sucesso_('restoreDefaultColors', {
    restauradas,
    config: obterConfig()
  });
}

function listAdminRecords(payload) {
  const entidade = obterEntidadeAdmin_(payload && payload.entidade);
  const sheet = obterPlanilha_().getSheetByName(entidade.sheet);

  if (!sheet) {
    return sucesso_('listAdminRecords', {
      entidade: entidade.nome,
      records: []
    });
  }

  const records = lerAbaComoObjetos_(sheet).map(function(row) {
    return normalizarRegistroAdmin_(row, entidade);
  }).sort(function(a, b) {
    return String(a.nome).localeCompare(String(b.nome));
  });

  return sucesso_('listAdminRecords', {
    entidade: entidade.nome,
    records
  });
}

function saveAdminRecord(payload) {
  const entidade = obterEntidadeAdmin_(payload && payload.entidade);
  const id = String(payload && payload.id || '').trim();
  const nome = String(payload && payload.nome || '').trim();
  const descricao = String(payload && payload.descricao || '').trim();
  const status = normalizar_(payload && payload.status || 'ativo');

  if (!nome) {
    return erro_('INVALID_RECORD', 'Informe o nome.', 'saveAdminRecord');
  }

  if (['ativo', 'inativo'].indexOf(status) === -1) {
    return erro_('INVALID_STATUS', 'Status inválido.', 'saveAdminRecord');
  }

  const sheet = obterPlanilha_().getSheetByName(entidade.sheet);
  const headers = obterHeaders_(sheet);
  validarColunasObrigatorias_(headers, [entidade.idCol, 'nome', 'descricao', 'status'], entidade.sheet);

  const idCol = obterIndiceColuna_(headers, entidade.idCol);
  const nomeCol = obterIndiceColuna_(headers, 'nome');
  const descCol = obterIndiceColuna_(headers, 'descricao');
  const statusCol = obterIndiceColuna_(headers, 'status');
  const cadastroCol = obterIndiceColuna_(headers, 'data_cadastro');
  const atualizacaoCol = obterIndiceColuna_(headers, 'data_atualizacao');
  const values = sheet.getDataRange().getValues();
  const agora = new Date();
  let linha = -1;
  let idFinal = id;

  if (idFinal) {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idCol] || '').trim() === idFinal) {
        linha = i + 1;
        break;
      }
    }
  }

  if (linha === -1) {
    idFinal = idFinal || `${entidade.prefixo}_${Utilities.getUuid().slice(0, 8)}`;
    const row = new Array(headers.length).fill('');
    row[idCol] = idFinal;
    row[nomeCol] = nome;
    row[descCol] = descricao;
    row[statusCol] = status;

    if (cadastroCol >= 0) {
      row[cadastroCol] = agora;
    }

    if (atualizacaoCol >= 0) {
      row[atualizacaoCol] = agora;
    }

    sheet.appendRow(row);
  } else {
    sheet.getRange(linha, nomeCol + 1).setValue(nome);
    sheet.getRange(linha, descCol + 1).setValue(descricao);
    sheet.getRange(linha, statusCol + 1).setValue(status);

    if (atualizacaoCol >= 0) {
      sheet.getRange(linha, atualizacaoCol + 1).setValue(agora);
    }
  }

  registrarAuditoria_('saveAdminRecord', entidade.sheet, JSON.stringify({
    id: idFinal,
    nome,
    status
  }));

  return sucesso_('saveAdminRecord', {
    entidade: entidade.nome,
    record: {
      id: idFinal,
      nome,
      descricao,
      status
    }
  });
}

function garantirAbasBase() {
  const ss = obterPlanilha_();
  const criadas = [];
  const validadas = [];

  Object.keys(SHEET_HEADERS).forEach(function(nome) {
    const result = criarAbaSeNaoExistir(nome, SHEET_HEADERS[nome], ss);

    if (result.criada) {
      criadas.push(nome);
    }

    validadas.push(nome);
  });

  return sucesso_('garantirAbasBase', {
    criadas,
    validadas
  });
}

function criarAbaSeNaoExistir(nome, headers, ss) {
  const planilha = ss || obterPlanilha_();
  let sheet = planilha.getSheetByName(nome);
  let criada = false;

  if (!sheet) {
    sheet = planilha.insertSheet(nome);
    criada = true;
  }

  garantirHeaders_(sheet, headers);

  return {
    sheet,
    criada
  };
}

function garantirConfigPadrao() {
  garantirAbasBase();

  const sheet = obterPlanilha_().getSheetByName('Config');
  const headers = obterHeaders_(sheet);
  const chaveCol = obterIndiceColuna_(headers, 'chave');
  const valorCol = obterIndiceColuna_(headers, 'valor');
  const descCol = obterIndiceColuna_(headers, 'descricao');
  const tipoCol = obterIndiceColuna_(headers, 'tipo');
  const atualizadoCol = obterIndiceColuna_(headers, 'data_atualizacao');
  const values = sheet.getDataRange().getValues();
  const existentes = {};
  const agora = new Date();
  const criadas = [];

  for (let i = 1; i < values.length; i++) {
    const chave = String(values[i][chaveCol] || '').trim();

    if (chave) {
      existentes[chave] = i + 1;
    }
  }

  CONFIG_PADRAO.forEach(function(item) {
    const chave = item[0];
    const valor = item[1];
    const descricao = item[2];
    const tipo = item[3];
    const linha = existentes[chave];

    if (!linha) {
      const row = new Array(headers.length).fill('');
      row[chaveCol] = chave;
      row[valorCol] = valor;
      row[descCol] = descricao;
      row[tipoCol] = tipo;
      row[atualizadoCol] = agora;
      sheet.appendRow(row);
      criadas.push(chave);
      return;
    }

    if (descCol >= 0 && !sheet.getRange(linha, descCol + 1).getValue()) {
      sheet.getRange(linha, descCol + 1).setValue(descricao);
    }

    if (tipoCol >= 0 && !sheet.getRange(linha, tipoCol + 1).getValue()) {
      sheet.getRange(linha, tipoCol + 1).setValue(tipo);
    }
  });

  return sucesso_('garantirConfigPadrao', {
    criadas
  });
}

function obterConfig() {
  const fallback = obterConfigFallback_();
  const sheet = obterPlanilha_().getSheetByName('Config');

  if (!sheet) {
    return fallback;
  }

  const rows = lerAbaComoObjetos_(sheet);

  rows.forEach(function(row) {
    const chave = String(row.chave || '').trim();

    if (chave) {
      fallback[chave] = row.valor == null ? '' : String(row.valor);
    }
  });

  return fallback;
}

function obterConfigDetalhada_() {
  const config = obterConfig();

  return CONFIG_PADRAO.map(function(item) {
    const chave = item[0];

    return {
      chave,
      valor: config[chave] || '',
      valor_padrao: item[1],
      descricao: item[2],
      tipo: item[3],
      editavel: ['drive_folder_id'].indexOf(chave) === -1
    };
  });
}

function obterDefinicaoConfig_(chave) {
  for (let i = 0; i < CONFIG_PADRAO.length; i++) {
    if (CONFIG_PADRAO[i][0] === chave) {
      return {
        chave: CONFIG_PADRAO[i][0],
        valor_padrao: CONFIG_PADRAO[i][1],
        descricao: CONFIG_PADRAO[i][2],
        tipo: CONFIG_PADRAO[i][3]
      };
    }
  }

  return null;
}

function obterEntidadeAdmin_(entidade) {
  const chave = normalizar_(entidade);
  const entidades = {
    categorias: {
      nome: 'categorias',
      sheet: 'Categorias',
      idCol: 'id_categoria',
      prefixo: 'cat'
    },
    grupos: {
      nome: 'grupos',
      sheet: 'Grupos',
      idCol: 'id_grupo',
      prefixo: 'grp'
    }
  };

  if (!entidades[chave]) {
    throw new Error('Entidade administrativa inválida.');
  }

  return entidades[chave];
}

function normalizarRegistroAdmin_(row, entidade) {
  return {
    id: row[entidade.idCol] || '',
    nome: row.nome || '',
    descricao: row.descricao || '',
    status: row.status || ''
  };
}

function validarValorConfig_(valor, definicao) {
  const texto = String(valor == null ? '' : valor).trim();

  if (definicao.chave === 'drive_folder_id') {
    throw new Error('Configuração gerenciada automaticamente pelo sistema.');
  }

  if (definicao.tipo === 'cor') {
    if (!/^#[0-9A-Fa-f]{6}$/.test(texto)) {
      throw new Error('Informe uma cor válida no formato #RRGGBB.');
    }

    return texto.toUpperCase();
  }

  if (definicao.tipo === 'numero') {
    const numero = Number(texto);

    if (!isFinite(numero) || numero < 0) {
      throw new Error('Informe um número válido maior ou igual a zero.');
    }

    return String(Math.floor(numero));
  }

  if (definicao.tipo === 'booleano') {
    const normalizado = normalizar_(texto);

    if (['sim', 'nao'].indexOf(normalizado) === -1) {
      throw new Error('Informe sim ou nao.');
    }

    return normalizado;
  }

  if (definicao.chave === 'modo_visual_padrao') {
    const normalizado = normalizar_(texto);

    if (['claro', 'escuro'].indexOf(normalizado) === -1) {
      throw new Error('Informe claro ou escuro.');
    }

    return normalizado;
  }

  return texto;
}

function salvarConfig(chave, valor) {
  garantirConfigPadrao();

  const sheet = obterPlanilha_().getSheetByName('Config');
  const headers = obterHeaders_(sheet);
  const chaveCol = obterIndiceColuna_(headers, 'chave');
  const valorCol = obterIndiceColuna_(headers, 'valor');
  const atualizadoCol = obterIndiceColuna_(headers, 'data_atualizacao');
  const values = sheet.getDataRange().getValues();
  const agora = new Date();

  validarColunasObrigatorias_(headers, ['chave', 'valor'], 'Config');

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][chaveCol] || '').trim() === chave) {
      sheet.getRange(i + 1, valorCol + 1).setValue(valor);

      if (atualizadoCol >= 0) {
        sheet.getRange(i + 1, atualizadoCol + 1).setValue(agora);
      }

      return sucesso_('salvarConfig', {
        chave,
        valor
      });
    }
  }

  const row = new Array(headers.length).fill('');
  row[chaveCol] = chave;
  row[valorCol] = valor;

  if (atualizadoCol >= 0) {
    row[atualizadoCol] = agora;
  }

  sheet.appendRow(row);

  return sucesso_('salvarConfig', {
    chave,
    valor
  });
}

function garantirPastaSistemaDrive() {
  garantirConfigPadrao();

  const config = obterConfig();
  const nomePasta = config.drive_folder_name || 'PAINEL TRANSMARES — Arquivos do Sistema';
  let folder = null;
  let criada = false;

  if (config.drive_folder_id) {
    try {
      folder = DriveApp.getFolderById(config.drive_folder_id);
    } catch (error) {
      folder = null;
    }
  }

  if (!folder) {
    const pastas = DriveApp.getFoldersByName(nomePasta);

    if (pastas.hasNext()) {
      folder = pastas.next();
    }
  }

  if (!folder) {
    folder = DriveApp.createFolder(nomePasta);
    criada = true;
  }

  if (folder.getId() !== config.drive_folder_id) {
    salvarConfig('drive_folder_id', folder.getId());
  }

  if (criada) {
    registrarAuditoria_('garantirPastaSistemaDrive', 'Drive', JSON.stringify({
      folderId: folder.getId(),
      folderName: folder.getName()
    }));
  }

  return sucesso_('garantirPastaSistemaDrive', {
    id: folder.getId(),
    nome: folder.getName(),
    url: folder.getUrl(),
    criada
  });
}

function diagnosticoFase1() {
  garantirAbasBase();
  garantirConfigPadrao();
  const config = obterConfig();
  const chavesNaPlanilha = obterChavesConfigPlanilha_();
  const pasta = garantirPastaSistemaDrive();
  const ss = obterPlanilha_();
  const abas = {};
  const configs = {};

  Object.keys(SHEET_HEADERS).forEach(function(nome) {
    const sheet = ss.getSheetByName(nome);
    const headers = sheet ? obterHeaders_(sheet) : [];
    const faltantes = SHEET_HEADERS[nome].filter(function(header) {
      return headers.indexOf(header) === -1;
    });

    abas[nome] = {
      existe: Boolean(sheet),
      linhas: sheet ? Math.max(0, sheet.getLastRow() - 1) : 0,
      headers_ok: faltantes.length === 0,
      headers_faltantes: faltantes
    };
  });

  CONFIG_PADRAO.forEach(function(item) {
    const chave = item[0];

    configs[chave] = {
      existe_na_planilha: chavesNaPlanilha.indexOf(chave) >= 0,
      valor: config[chave] || ''
    };
  });

  return sucesso_('diagnosticoFase1', {
    usuario: obterUsuarioAutorizado_(),
    planilha_id: SPREADSHEET_ID,
    abas,
    configs,
    drive: pasta.data,
    timestamp: new Date().toISOString()
  });
}

function obterPlanilha_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function obterEmailUsuarioAtual_() {
  const activeEmail = Session.getActiveUser().getEmail();
  const effectiveEmail = Session.getEffectiveUser().getEmail();

  return activeEmail || effectiveEmail || '';
}

function obterUsuarioAutorizado_() {
  const email = obterEmailUsuarioAtual_();
  const usuario = buscarUsuarioPorEmail_(email);

  if (!email) {
    throw new Error('Não foi possível identificar o e-mail da Conta Google.');
  }

  if (!usuario) {
    throw new Error('Usuário não cadastrado.');
  }

  if (normalizar_(usuario.status) !== 'ativo') {
    throw new Error('Usuário inativo.');
  }

  return usuario;
}

function exigirGestor_() {
  const usuario = obterUsuarioAutorizado_();

  if (normalizar_(usuario.perfil) !== 'gestor') {
    throw new Error('Ação permitida apenas para gestor.');
  }

  return usuario;
}

function buscarUsuarioPorEmail_(email) {
  const sheet = obterPlanilha_().getSheetByName('Usuarios');

  if (!sheet || !email) {
    return null;
  }

  const usuarios = lerAbaComoObjetos_(sheet);
  const emailNormalizado = normalizar_(email);

  for (let i = 0; i < usuarios.length; i++) {
    if (normalizar_(usuarios[i].email) === emailNormalizado) {
      return usuarios[i];
    }
  }

  return null;
}

function obterCardsPorPerfil_(perfil) {
  const cards = [
    {
      id: 'links-corretora',
      titulo: 'Links Úteis — Corretora',
      descricao: 'Acesso aos principais links operacionais da corretora.'
    },
    {
      id: 'links-ar',
      titulo: 'Links Úteis — AR / Certificação',
      descricao: 'Links úteis para rotina de certificação digital.'
    }
  ];

  if (normalizar_(perfil) === 'gestor') {
    cards.push({
      id: 'links-gestao',
      titulo: 'Links Úteis — Gestão',
      descricao: 'Links administrativos e de acompanhamento gerencial.'
    });
  }

  cards.push(
    {
      id: 'central-senhas',
      titulo: 'Central de Senhas',
      descricao: 'Base futura para senhas e acessos internos.'
    },
    {
      id: 'painel-ar',
      titulo: 'Painel AR',
      descricao: 'Base futura para geração e acompanhamento de links AR.'
    }
  );

  if (normalizar_(perfil) === 'gestor') {
    cards.push({
      id: 'administracao',
      titulo: 'Administração',
      descricao: 'Configurações e cadastros administrativos do HUB.'
    });
  }

  return cards;
}

function obterAvisosIniciais_(config) {
  const sheet = obterPlanilha_().getSheetByName('Avisos_Internos');
  const limite = obterNumeroConfig_(config, 'limite_avisos', 3);

  if (!sheet || limite <= 0) {
    return [];
  }

  const hoje = inicioDoDia_(new Date());
  const avisos = lerAbaComoObjetos_(sheet).filter(function(aviso) {
    if (normalizar_(aviso.status) !== 'ativo') {
      return false;
    }

    const inicio = converterData_(aviso.data_inicio);
    const fim = converterData_(aviso.data_fim);

    if (inicio && inicioDoDia_(inicio) > hoje) {
      return false;
    }

    if (fim && inicioDoDia_(fim) < hoje) {
      return false;
    }

    return true;
  }).sort(function(a, b) {
    const dataA = converterData_(a.data_inicio) || converterData_(a.data_cadastro) || new Date(0);
    const dataB = converterData_(b.data_inicio) || converterData_(b.data_cadastro) || new Date(0);
    return dataB.getTime() - dataA.getTime();
  }).slice(0, limite);

  return avisos.map(function(aviso) {
    return {
      id: aviso.id_aviso || '',
      titulo: aviso.titulo || 'Aviso',
      mensagem: aviso.mensagem || '',
      data_inicio: formatarData_(aviso.data_inicio),
      data_fim: formatarData_(aviso.data_fim)
    };
  });
}

function obterAniversariantesIniciais_(config) {
  const sheet = obterPlanilha_().getSheetByName('Aniversarios');
  const janelaDias = obterNumeroConfig_(config, 'janela_aniversarios_dias', 15);
  const limite = obterNumeroConfig_(config, 'limite_aniversariantes', 25);

  if (!sheet || janelaDias <= 0 || limite <= 0) {
    return [];
  }

  const hoje = inicioDoDia_(new Date());

  return lerAbaComoObjetos_(sheet).map(function(item) {
    const aniversario = calcularProximoAniversario_(item.data_nascimento, hoje);

    if (!aniversario || normalizar_(item.status) !== 'ativo') {
      return null;
    }

    return {
      id: item.id_aniversario || '',
      nome: item.nome || '',
      tipo: item.tipo || '',
      data: aniversario.dataFormatada,
      dias_ate: aniversario.diasAte,
      observacao: item.observacao || ''
    };
  }).filter(function(item) {
    return item && item.nome && item.dias_ate >= 0 && item.dias_ate <= janelaDias;
  }).sort(function(a, b) {
    return a.dias_ate - b.dias_ate || String(a.nome).localeCompare(String(b.nome));
  }).slice(0, limite);
}

function obterFavoritosIniciais_(usuario, config) {
  const sheet = obterPlanilha_().getSheetByName('Itens');
  const limite = obterNumeroConfig_(config, 'limite_favoritos', 5);

  if (!sheet || limite <= 0) {
    return [];
  }

  const emailUsuario = normalizar_(usuario.email);
  const favoritos = lerAbaComoObjetos_(sheet).filter(function(item) {
    const statusAtivo = normalizar_(item.status) === 'ativo';
    const tipo = normalizar_(item.tipo);
    const usuarioItem = normalizar_(item.usuario_email || item.email_usuario || item.criado_por);
    const marcadoComoFavorito = ['favorito', 'favoritos', 'link_rapido', 'links_rapidos'].indexOf(tipo) >= 0;
    const pertenceAoUsuario = !usuarioItem || usuarioItem === emailUsuario;

    return statusAtivo && marcadoComoFavorito && pertenceAoUsuario && item.url;
  }).slice(0, limite);

  return favoritos.map(function(item) {
    return {
      id: item.id_item || '',
      titulo: item.titulo || 'Link',
      url: item.url || '',
      descricao: item.descricao || ''
    };
  });
}

function obterLimitesConfig_(config) {
  return {
    favoritos: obterNumeroConfig_(config, 'limite_favoritos', 5),
    avisos: obterNumeroConfig_(config, 'limite_avisos', 3),
    aniversariantes: obterNumeroConfig_(config, 'limite_aniversariantes', 25),
    janela_aniversarios_dias: obterNumeroConfig_(config, 'janela_aniversarios_dias', 15),
    retencao_historico_meses: obterNumeroConfig_(config, 'retencao_historico_meses', 12)
  };
}

function obterNumeroConfig_(config, chave, fallback) {
  const numero = Number(config && config[chave]);

  if (!isFinite(numero)) {
    return fallback;
  }

  return Math.max(0, Math.floor(numero));
}

function garantirHeaders_(sheet, headersEsperados) {
  if (sheet.getMaxColumns() < headersEsperados.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headersEsperados.length - sheet.getMaxColumns());
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headersEsperados.length).setValues([headersEsperados]);
    return;
  }

  const largura = Math.max(sheet.getLastColumn(), headersEsperados.length);
  const headersAtuais = sheet.getRange(1, 1, 1, largura).getValues()[0].map(function(header) {
    return String(header || '').trim();
  });
  const faltantes = headersEsperados.filter(function(header) {
    return headersAtuais.indexOf(header) === -1;
  });

  if (!headersAtuais.some(Boolean)) {
    sheet.getRange(1, 1, 1, headersEsperados.length).setValues([headersEsperados]);
    return;
  }

  faltantes.forEach(function(header) {
    const proximaColuna = sheet.getLastColumn() + 1;
    sheet.getRange(1, proximaColuna).setValue(header);
  });
}

function obterHeaders_(sheet) {
  if (!sheet || sheet.getLastRow() === 0) {
    return [];
  }

  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function(header) {
    return String(header || '').trim();
  });
}

function obterIndiceColuna_(headers, nome) {
  return headers.indexOf(nome);
}

function lerAbaComoObjetos_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(header) {
    return String(header || '').trim();
  });

  return values.slice(1).filter(function(row) {
    return row.some(function(value) {
      return value !== '';
    });
  }).map(function(row) {
    const obj = {};

    headers.forEach(function(header, index) {
      if (header) {
        obj[header] = row[index];
      }
    });

    return obj;
  });
}

function obterConfigFallback_() {
  const config = {};

  CONFIG_PADRAO.forEach(function(item) {
    config[item[0]] = item[1];
  });

  return config;
}

function obterChavesConfigPlanilha_() {
  const sheet = obterPlanilha_().getSheetByName('Config');

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).map(function(row) {
    return String(row.chave || '').trim();
  }).filter(Boolean);
}

function calcularProximoAniversario_(valor, hoje) {
  const partes = extrairDiaMes_(valor);

  if (!partes) {
    return null;
  }

  const anoAtual = hoje.getFullYear();
  let proximo = new Date(anoAtual, partes.mes - 1, partes.dia);

  if (inicioDoDia_(proximo) < hoje) {
    proximo = new Date(anoAtual + 1, partes.mes - 1, partes.dia);
  }

  const diasAte = Math.round((inicioDoDia_(proximo).getTime() - hoje.getTime()) / 86400000);

  return {
    diasAte,
    dataFormatada: Utilities.formatDate(proximo, obterTimeZone_(), 'dd/MM')
  };
}

function extrairDiaMes_(valor) {
  if (!valor) {
    return null;
  }

  if (Object.prototype.toString.call(valor) === '[object Date]' && !isNaN(valor.getTime())) {
    return {
      dia: valor.getDate(),
      mes: valor.getMonth() + 1
    };
  }

  const texto = String(valor).trim();
  const match = texto.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/);

  if (!match) {
    return null;
  }

  const dia = Number(match[1]);
  const mes = Number(match[2]);

  if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
    return null;
  }

  return {
    dia,
    mes
  };
}

function converterData_(valor) {
  if (!valor) {
    return null;
  }

  if (Object.prototype.toString.call(valor) === '[object Date]' && !isNaN(valor.getTime())) {
    return valor;
  }

  const texto = String(valor).trim();
  const match = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);

  if (!match) {
    return null;
  }

  const dia = Number(match[1]);
  const mes = Number(match[2]);
  let ano = Number(match[3]);

  if (ano < 100) {
    ano += 2000;
  }

  return new Date(ano, mes - 1, dia);
}

function formatarData_(valor) {
  const data = converterData_(valor);

  if (!data) {
    return '';
  }

  return Utilities.formatDate(data, obterTimeZone_(), 'dd/MM/yyyy');
}

function inicioDoDia_(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function obterTimeZone_() {
  return Session.getScriptTimeZone() || 'America/Sao_Paulo';
}

function registrarAuditoria_(acao, entidade, detalhes) {
  try {
    const sheet = obterPlanilha_().getSheetByName('Historico_Auditoria');

    if (!sheet) {
      return;
    }

    const headers = obterHeaders_(sheet);
    const row = new Array(headers.length).fill('');
    row[obterIndiceColuna_(headers, 'id_evento')] = Utilities.getUuid();
    row[obterIndiceColuna_(headers, 'data_evento')] = new Date();
    row[obterIndiceColuna_(headers, 'usuario_email')] = obterEmailUsuarioAtual_();
    row[obterIndiceColuna_(headers, 'acao')] = acao;
    row[obterIndiceColuna_(headers, 'entidade')] = entidade;
    row[obterIndiceColuna_(headers, 'detalhes')] = detalhes || '';
    sheet.appendRow(row);
  } catch (error) {
    // Auditoria não deve bloquear a ação principal.
  }
}

function validarColunasObrigatorias_(headers, colunas, contexto) {
  const faltantes = colunas.filter(function(coluna) {
    return headers.indexOf(coluna) === -1;
  });

  if (faltantes.length) {
    throw new Error(`${contexto}: cabeçalhos obrigatórios ausentes: ${faltantes.join(', ')}`);
  }
}

function obterCodigoErro_(error) {
  const mensagem = normalizar_(error && error.message);

  if (mensagem.indexOf('não foi possível identificar') >= 0) {
    return 'USER_EMAIL_NOT_AVAILABLE';
  }

  if (mensagem.indexOf('não cadastrado') >= 0) {
    return 'USER_NOT_REGISTERED';
  }

  if (mensagem.indexOf('inativo') >= 0) {
    return 'USER_INACTIVE';
  }

  if (mensagem.indexOf('apenas para gestor') >= 0) {
    return 'GESTOR_REQUIRED';
  }

  if (mensagem.indexOf('cabeçalhos obrigatórios ausentes') >= 0) {
    return 'INVALID_SHEET_HEADERS';
  }

  return 'INTERNAL_ERROR';
}

function parsePayload_(payload) {
  if (!payload) {
    return {};
  }

  try {
    return JSON.parse(payload);
  } catch (error) {
    return {};
  }
}

function respostaJson_(obj, callback) {
  const json = JSON.stringify(obj);
  const callbackSeguro = String(callback || '').match(/^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/)
    ? callback
    : '';
  const output = callbackSeguro ? `${callbackSeguro}(${json});` : json;
  const mimeType = callbackSeguro
    ? ContentService.MimeType.JAVASCRIPT
    : ContentService.MimeType.JSON;

  return ContentService.createTextOutput(output).setMimeType(mimeType);
}

function sucesso_(action, data) {
  return {
    ok: true,
    action,
    data
  };
}

function erro_(code, message, action) {
  return {
    ok: false,
    action,
    message,
    error: {
      code,
      message
    }
  };
}

function normalizar_(value) {
  return String(value || '').trim().toLowerCase();
}
