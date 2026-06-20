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
      default:
        result = erro_('ACTION_NOT_FOUND', 'Ação não encontrada.', action);
    }

    return respostaJson_(result, callback);
  } catch (error) {
    return respostaJson_(erro_('INTERNAL_ERROR', error.message || 'Erro interno.', action), callback);
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

  return sucesso_('getInitialData', {
    usuario,
    config,
    drive: pasta.data,
    cards: obterCardsPorPerfil_(usuario.perfil),
    avisos: [],
    aniversariantes: [],
    favoritos: []
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

function salvarConfig(chave, valor) {
  garantirConfigPadrao();

  const sheet = obterPlanilha_().getSheetByName('Config');
  const headers = obterHeaders_(sheet);
  const chaveCol = obterIndiceColuna_(headers, 'chave');
  const valorCol = obterIndiceColuna_(headers, 'valor');
  const atualizadoCol = obterIndiceColuna_(headers, 'data_atualizacao');
  const values = sheet.getDataRange().getValues();
  const agora = new Date();

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
  row[atualizadoCol] = agora;
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
    criada
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
