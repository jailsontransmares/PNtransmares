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
    'login',
    'senha',
    'categoria',
    'grupo',
    'status',
    'favorito_emails',
    'criado_por',
    'data_cadastro',
    'data_atualizacao',
    'data_favorito_atualizacao'
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
    'nome_completo',
    'nome_empresa',
    'cnpj_empresa',
    'codigo_revendedor',
    'email_cadastro_certificado',
    'status',
    'remunerado',
    'whatsapp_pessoal',
    'whatsapp_comercial',
    'email_comercial',
    'chave_pix',
    'nome_chave_pix',
    'observacao',
    'observacoes',
    'data_cadastro',
    'data_atualizacao',
    'atualizado_em'
  ],
  Historico_Links: [
    'id_historico',
    'data_geracao',
    'data_hora',
    'usuario',
    'usuario_email',
    'parceiro',
    'parceiro_id',
    'codigo_revendedor',
    'status_parceiro',
    'produto',
    'product_id',
    'ac',
    'tipo_certificado',
    'midia',
    'modelo',
    'validade',
    'grupo',
    'link',
    'link_com_desconto',
    'link_sem_desconto',
    'preco_com_desconto',
    'preco_sem_desconto',
    'economia',
    'status',
    'origem',
    'observacoes'
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
  ['limite_avisos', '3', 'Quantidade máxima de avisos ativos exibidos no painel.', 'numero'],
  ['ar_produtos_spreadsheet_id', '1olfAYqFNswgvnvPdNWp7bZ0IEJ1DKYj2z6ZiPvKcjjk', 'ID da planilha de produtos do Painel AR.', 'texto'],
  ['ar_produtos_sheet_name', 'Produtos', 'Nome da aba de produtos do Painel AR.', 'texto'],
  ['ar_url_base_padrao', '', 'URL base padrão do Painel AR quando o produto não informar URL base.', 'texto'],
  ['ar_link_com_desconto_template', '{url_base}?product_id={product_id}&codrev={codigo_revendedor}&grupo={grupo_com_desconto}', 'Template padrão do link AR com desconto.', 'texto'],
  ['ar_link_sem_desconto_template', '{url_base}?product_id={product_id}&codrev={codigo_revendedor}&grupo={grupo_sem_desconto}', 'Template padrão do link AR sem desconto.', 'texto'],
  ['ar_link_templates_json', '', 'Templates de links AR em lote por grupo/código.', 'texto']
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
      case 'diagnosticoFase2':
        exigirGestor_();
        result = diagnosticoFase2();
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
      case 'getLinksData':
        result = getLinksData(payload);
        break;
      case 'saveLinkItem':
        exigirGestor_();
        result = saveLinkItem(payload);
        break;
      case 'toggleFavoriteLink':
        result = toggleFavoriteLink(payload);
        break;
      case 'diagnosticoFase3':
        exigirGestor_();
        result = diagnosticoFase3();
        break;
      case 'getPasswordsData':
        result = getPasswordsData(payload);
        break;
      case 'savePasswordItem':
        exigirGestor_();
        result = savePasswordItem(payload);
        break;
      case 'diagnosticoFase4':
        exigirGestor_();
        result = diagnosticoFase4();
        break;
      case 'getArData':
        result = getArData(payload);
        break;
      case 'generateArLinks':
        result = generateArLinks(payload);
        break;
      case 'diagnosticoFase5':
        exigirGestor_();
        result = diagnosticoFase5();
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

function getLinksData(payload) {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const escopo = normalizar_(payload && payload.escopo || 'corretora');
  const filtros = {
    categoria: String(payload && payload.categoria || '').trim(),
    grupo: String(payload && payload.grupo || '').trim(),
    status: normalizar_(payload && payload.status || '')
  };
  const gestor = normalizar_(usuario.perfil) === 'gestor';
  const config = obterConfig();
  const categorias = listarRegistrosAtivosAdmin_('categorias');
  const grupos = listarRegistrosAtivosAdmin_('grupos');
  const links = listarLinksUteis_({
    escopo,
    filtros,
    gestor,
    usuario
  });

  return sucesso_('getLinksData', {
    usuario: {
      perfil: usuario.perfil,
      gestor
    },
    escopo,
    limite_favoritos: obterNumeroConfig_(config, 'limite_favoritos', 5),
    categorias,
    grupos,
    links
  });
}

function saveLinkItem(payload) {
  garantirAbasBase();
  const id = String(payload && payload.id || '').trim();
  const titulo = String(payload && payload.titulo || '').trim();
  const descricao = String(payload && payload.descricao || '').trim();
  const url = String(payload && payload.url || '').trim();
  const categoria = String(payload && payload.categoria || '').trim();
  const grupo = String(payload && payload.grupo || '').trim();
  const status = normalizar_(payload && payload.status || 'ativo');
  const escopo = normalizar_(payload && payload.escopo || 'corretora');
  const usuario = obterUsuarioAutorizado_();

  if (!titulo) {
    return erro_('INVALID_LINK', 'Informe o título.', 'saveLinkItem');
  }

  if (!url || !/^https?:\/\//i.test(url)) {
    return erro_('INVALID_URL', 'Informe uma URL começando com http:// ou https://.', 'saveLinkItem');
  }

  if (['ativo', 'inativo'].indexOf(status) === -1) {
    return erro_('INVALID_STATUS', 'Status inválido.', 'saveLinkItem');
  }

  const sheet = obterPlanilha_().getSheetByName('Itens');
  const headers = obterHeaders_(sheet);
  validarColunasObrigatorias_(headers, ['id_item', 'tipo', 'titulo', 'descricao', 'url', 'categoria', 'grupo', 'status'], 'Itens');

  const cols = obterMapaColunas_(headers);
  const values = sheet.getDataRange().getValues();
  const agora = new Date();
  let linha = -1;
  let idFinal = id;

  if (idFinal) {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][cols.id_item] || '').trim() === idFinal) {
        linha = i + 1;
        break;
      }
    }
  }

  if (linha === -1) {
    idFinal = idFinal || `link_${Utilities.getUuid().slice(0, 8)}`;
    const row = new Array(headers.length).fill('');
    row[cols.id_item] = idFinal;
    row[cols.tipo] = obterTipoLinkPorEscopo_(escopo);
    row[cols.titulo] = titulo;
    row[cols.descricao] = descricao;
    row[cols.url] = url;
    row[cols.categoria] = categoria;
    row[cols.grupo] = grupo;
    row[cols.status] = status;

    if (cols.criado_por >= 0) {
      row[cols.criado_por] = usuario.email;
    }

    if (cols.data_cadastro >= 0) {
      row[cols.data_cadastro] = agora;
    }

    if (cols.data_atualizacao >= 0) {
      row[cols.data_atualizacao] = agora;
    }

    sheet.appendRow(row);
  } else {
    sheet.getRange(linha, cols.tipo + 1).setValue(obterTipoLinkPorEscopo_(escopo));
    sheet.getRange(linha, cols.titulo + 1).setValue(titulo);
    sheet.getRange(linha, cols.descricao + 1).setValue(descricao);
    sheet.getRange(linha, cols.url + 1).setValue(url);
    sheet.getRange(linha, cols.categoria + 1).setValue(categoria);
    sheet.getRange(linha, cols.grupo + 1).setValue(grupo);
    sheet.getRange(linha, cols.status + 1).setValue(status);

    if (cols.data_atualizacao >= 0) {
      sheet.getRange(linha, cols.data_atualizacao + 1).setValue(agora);
    }
  }

  registrarAuditoria_('saveLinkItem', 'Itens', JSON.stringify({
    id: idFinal,
    titulo,
    escopo,
    status
  }));

  return sucesso_('saveLinkItem', {
    item: {
      id: idFinal,
      titulo,
      descricao,
      url,
      categoria,
      grupo,
      status,
      escopo
    }
  });
}

function toggleFavoriteLink(payload) {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const id = String(payload && payload.id || '').trim();
  const favorito = Boolean(payload && payload.favorito);
  const config = obterConfig();
  const limite = obterNumeroConfig_(config, 'limite_favoritos', 5);

  if (!id) {
    return erro_('INVALID_LINK', 'Link inválido.', 'toggleFavoriteLink');
  }

  const sheet = obterPlanilha_().getSheetByName('Itens');
  const headers = obterHeaders_(sheet);
  validarColunasObrigatorias_(headers, ['id_item', 'favorito_emails'], 'Itens');
  const cols = obterMapaColunas_(headers);
  const values = sheet.getDataRange().getValues();
  const email = normalizar_(usuario.email);
  const favoritosAtuais = obterIdsFavoritosUsuario_(email);

  if (favorito && favoritosAtuais.indexOf(id) === -1 && favoritosAtuais.length >= limite) {
    return erro_('FAVORITE_LIMIT_REACHED', `Limite de ${limite} favoritos atingido.`, 'toggleFavoriteLink');
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][cols.id_item] || '').trim() === id) {
      const emails = parseListaEmails_(values[i][cols.favorito_emails]);
      const atualizados = favorito
        ? adicionarEmailLista_(emails, email)
        : removerEmailLista_(emails, email);

      sheet.getRange(i + 1, cols.favorito_emails + 1).setValue(atualizados.join(', '));

      if (cols.data_favorito_atualizacao >= 0) {
        sheet.getRange(i + 1, cols.data_favorito_atualizacao + 1).setValue(new Date());
      }

      return sucesso_('toggleFavoriteLink', {
        id,
        favorito,
        favoritos_count: favorito
          ? favoritosAtuais.concat([id]).filter(function(value, index, array) { return array.indexOf(value) === index; }).length
          : favoritosAtuais.filter(function(value) { return value !== id; }).length,
        limite
      });
    }
  }

  return erro_('LINK_NOT_FOUND', 'Link não encontrado.', 'toggleFavoriteLink');
}

function getPasswordsData(payload) {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const gestor = normalizar_(usuario.perfil) === 'gestor';
  const filtros = {
    categoria: String(payload && payload.categoria || '').trim(),
    grupo: String(payload && payload.grupo || '').trim(),
    status: normalizar_(payload && payload.status || '')
  };

  return sucesso_('getPasswordsData', {
    usuario: {
      perfil: usuario.perfil,
      gestor
    },
    categorias: listarRegistrosAtivosAdmin_('categorias'),
    grupos: listarRegistrosAtivosAdmin_('grupos'),
    resumo: obterResumoSenhas_(gestor),
    historico: gestor ? listarHistoricoSenhas_(8) : [],
    acessos: listarAcessosSenha_({
      filtros,
      gestor
    })
  });
}

function savePasswordItem(payload) {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const id = String(payload && payload.id || '').trim();
  const titulo = String(payload && payload.titulo || '').trim();
  const descricao = String(payload && payload.descricao || '').trim();
  const url = String(payload && payload.url || '').trim();
  const login = String(payload && payload.login || '').trim();
  const senha = String(payload && payload.senha || '').trim();
  const categoria = String(payload && payload.categoria || '').trim();
  const grupo = String(payload && payload.grupo || '').trim();
  const status = normalizar_(payload && payload.status || 'ativo');

  if (!titulo) {
    return erro_('INVALID_PASSWORD_ITEM', 'Informe o título.', 'savePasswordItem');
  }

  if (!login) {
    return erro_('INVALID_LOGIN', 'Informe o usuário/login.', 'savePasswordItem');
  }

  if (!senha) {
    return erro_('INVALID_PASSWORD', 'Informe a senha.', 'savePasswordItem');
  }

  if (url && !/^https?:\/\//i.test(url)) {
    return erro_('INVALID_URL', 'Informe uma URL começando com http:// ou https://.', 'savePasswordItem');
  }

  if (['ativo', 'inativo'].indexOf(status) === -1) {
    return erro_('INVALID_STATUS', 'Status inválido.', 'savePasswordItem');
  }

  const sheet = obterPlanilha_().getSheetByName('Itens');
  const headers = obterHeaders_(sheet);
  validarColunasObrigatorias_(headers, ['id_item', 'tipo', 'titulo', 'descricao', 'url', 'login', 'senha', 'categoria', 'grupo', 'status'], 'Itens');
  const cols = obterMapaColunas_(headers);
  const values = sheet.getDataRange().getValues();
  const agora = new Date();
  let linha = -1;
  let idFinal = id;

  if (idFinal) {
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][cols.id_item] || '').trim() === idFinal) {
        linha = i + 1;
        break;
      }
    }
  }

  const operacao = linha === -1 ? 'criacao' : 'edicao';

  if (linha === -1) {
    idFinal = idFinal || `senha_${Utilities.getUuid().slice(0, 8)}`;
    const row = new Array(headers.length).fill('');
    row[cols.id_item] = idFinal;
    row[cols.tipo] = 'senha_acesso';
    row[cols.titulo] = titulo;
    row[cols.descricao] = descricao;
    row[cols.url] = url;
    row[cols.login] = login;
    row[cols.senha] = senha;
    row[cols.categoria] = categoria;
    row[cols.grupo] = grupo;
    row[cols.status] = status;

    if (cols.criado_por >= 0) {
      row[cols.criado_por] = usuario.email;
    }

    if (cols.data_cadastro >= 0) {
      row[cols.data_cadastro] = agora;
    }

    if (cols.data_atualizacao >= 0) {
      row[cols.data_atualizacao] = agora;
    }

    sheet.appendRow(row);
  } else {
    sheet.getRange(linha, cols.tipo + 1).setValue('senha_acesso');
    sheet.getRange(linha, cols.titulo + 1).setValue(titulo);
    sheet.getRange(linha, cols.descricao + 1).setValue(descricao);
    sheet.getRange(linha, cols.url + 1).setValue(url);
    sheet.getRange(linha, cols.login + 1).setValue(login);
    sheet.getRange(linha, cols.senha + 1).setValue(senha);
    sheet.getRange(linha, cols.categoria + 1).setValue(categoria);
    sheet.getRange(linha, cols.grupo + 1).setValue(grupo);
    sheet.getRange(linha, cols.status + 1).setValue(status);

    if (cols.data_atualizacao >= 0) {
      sheet.getRange(linha, cols.data_atualizacao + 1).setValue(agora);
    }
  }

  registrarAuditoria_('savePasswordItem', 'Itens', JSON.stringify({
    id: idFinal,
    titulo,
    status,
    operacao
  }));

  return sucesso_('savePasswordItem', {
    item: {
      id: idFinal,
      titulo,
      descricao,
      url,
      login,
      senha,
      categoria,
      grupo,
      status
    }
  });
}

function diagnosticoFase4() {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const gestor = normalizar_(usuario.perfil) === 'gestor';

  return sucesso_('diagnosticoFase4', {
    usuario: {
      email: usuario.email,
      perfil: usuario.perfil,
      gestor
    },
    central_senhas: obterResumoSenhas_(true),
    historico: listarHistoricoSenhas_(5),
    endpoints: [
      'getPasswordsData',
      'savePasswordItem',
      'diagnosticoFase4'
    ],
    timestamp: new Date().toISOString()
  });
}

function getArData(payload) {
  garantirAbasBase();
  garantirConfigPadrao();
  const usuario = obterUsuarioAutorizado_();
  const gestor = normalizar_(usuario.perfil) === 'gestor';
  const config = obterConfig();
  const produtos = listarProdutosAr_(config);
  const parceiros = listarParceirosAr_();

  return sucesso_('getArData', {
    usuario: {
      perfil: usuario.perfil,
      gestor
    },
    produtos,
    parceiros,
    historico: gestor ? listarHistoricoAr_(10) : [],
    meta: {
      produtos_total: produtos.length,
      parceiros_total: parceiros.length,
      templates_configurados: Boolean(config.ar_link_com_desconto_template && config.ar_link_sem_desconto_template)
        || Boolean(String(config.ar_link_templates_json || '').trim())
    }
  });
}

function generateArLinks(payload) {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const config = obterConfig();
  const produtoId = String(payload && payload.produto_id || '').trim();
  const parceiroId = String(payload && payload.parceiro_id || '').trim();
  const produto = obterProdutoArPorId_(config, produtoId);
  const parceiro = obterParceiroArPorId_(parceiroId);
  const alertas = [];

  if (!produto) {
    return erro_('AR_PRODUCT_REQUIRED', 'Selecione um produto válido.', 'generateArLinks');
  }

  if (!parceiro) {
    return erro_('AR_PARTNER_REQUIRED', 'Selecione um parceiro válido.', 'generateArLinks');
  }

  if (!produto.product_id) {
    return erro_('AR_PRODUCT_WITHOUT_ID', 'Produto sem Product ID. O link não será gerado.', 'generateArLinks');
  }

  if (!parceiro.codigo_revendedor) {
    return erro_('AR_PARTNER_WITHOUT_CODE', 'Parceiro sem código revendedor. O link não será gerado.', 'generateArLinks');
  }

  const statusParceiro = normalizar_(parceiro.status);

  if (statusParceiro === 'inativo') {
    return erro_('AR_PARTNER_INACTIVE', 'Parceiro inativo. O link não será gerado.', 'generateArLinks');
  }

  if (statusParceiro.indexOf('pendente') >= 0) {
    alertas.push('Parceiro com cadastro pendente. Confira antes de usar o link.');
  }

  if (!produto.preco_com_desconto || !produto.preco_sem_desconto) {
    alertas.push('Produto com preço incompleto.');
  }

  const linkComDesconto = montarLinkAr_(config, produto, parceiro, 'com_desconto');
  const linkSemDesconto = montarLinkAr_(config, produto, parceiro, 'sem_desconto');

  if (!linkComDesconto || !linkSemDesconto) {
    return erro_('AR_TEMPLATE_MISSING', 'Templates de link AR não configurados.', 'generateArLinks');
  }

  const historico = salvarHistoricoAr_(usuario, produto, parceiro, linkComDesconto, linkSemDesconto);
  registrarAuditoria_('generateArLinks', 'Historico_Links', JSON.stringify({
    produto: produto.descricao_comercial,
    product_id: produto.product_id,
    parceiro: parceiro.nome_completo || parceiro.nome,
    codigo_revendedor: parceiro.codigo_revendedor
  }));

  return sucesso_('generateArLinks', {
    produto,
    parceiro,
    links: {
      com_desconto: linkComDesconto,
      sem_desconto: linkSemDesconto
    },
    historico_salvo: true,
    historico_id: historico && historico.id_historico || '',
    alertas
  });
}

function diagnosticoFase5() {
  garantirAbasBase();
  garantirConfigPadrao();
  const config = obterConfig();
  const produtos = listarProdutosAr_(config);
  const parceiros = listarParceirosAr_();

  return sucesso_('diagnosticoFase5', {
    produtos: {
      total: produtos.length,
      incompletos: produtos.filter(function(produto) {
        return produto.alertas.length > 0;
      }).length
    },
    parceiros: {
      total: parceiros.length,
      ativos: parceiros.filter(function(parceiro) {
        return normalizar_(parceiro.status) === 'ativo';
      }).length,
      sem_codigo: parceiros.filter(function(parceiro) {
        return !parceiro.codigo_revendedor;
      }).length
    },
    historico: listarHistoricoAr_(5),
    configs: {
      ar_produtos_spreadsheet_id: config.ar_produtos_spreadsheet_id || '',
      ar_produtos_sheet_name: config.ar_produtos_sheet_name || '',
      templates_configurados: Boolean(config.ar_link_com_desconto_template && config.ar_link_sem_desconto_template)
        || Boolean(String(config.ar_link_templates_json || '').trim())
    },
    endpoints: [
      'getArData',
      'generateArLinks',
      'diagnosticoFase5'
    ],
    timestamp: new Date().toISOString()
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

function listarRegistrosAtivosAdmin_(entidadeNome) {
  const entidade = obterEntidadeAdmin_(entidadeNome);
  const sheet = obterPlanilha_().getSheetByName(entidade.sheet);

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).map(function(row) {
    return normalizarRegistroAdmin_(row, entidade);
  }).filter(function(record) {
    return normalizar_(record.status) === 'ativo';
  }).sort(function(a, b) {
    return String(a.nome).localeCompare(String(b.nome));
  });
}

function listarLinksUteis_(options) {
  const sheet = obterPlanilha_().getSheetByName('Itens');

  if (!sheet) {
    return [];
  }

  const tipoEsperado = obterTipoLinkPorEscopo_(options.escopo);
  const filtros = options.filtros || {};
  const emailUsuario = normalizar_(options.usuario && options.usuario.email);

  return lerAbaComoObjetos_(sheet).filter(function(item) {
    if (normalizar_(item.tipo) !== tipoEsperado) {
      return false;
    }

    if (!options.gestor && normalizar_(item.status) !== 'ativo') {
      return false;
    }

    if (filtros.status && normalizar_(item.status) !== filtros.status) {
      return false;
    }

    if (filtros.categoria && String(item.categoria || '') !== filtros.categoria) {
      return false;
    }

    if (filtros.grupo && String(item.grupo || '') !== filtros.grupo) {
      return false;
    }

    return true;
  }).map(function(item) {
    return {
      id: item.id_item || '',
      titulo: item.titulo || '',
      descricao: item.descricao || '',
      url: item.url || '',
      categoria: item.categoria || '',
      grupo: item.grupo || '',
      status: item.status || '',
      favorito: parseListaEmails_(item.favorito_emails).indexOf(emailUsuario) >= 0
    };
  }).sort(function(a, b) {
    return String(a.titulo).localeCompare(String(b.titulo));
  });
}

function obterIdsFavoritosUsuario_(email) {
  const sheet = obterPlanilha_().getSheetByName('Itens');

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).filter(function(item) {
    return normalizar_(item.status) === 'ativo'
      && parseListaEmails_(item.favorito_emails).indexOf(email) >= 0;
  }).map(function(item) {
    return item.id_item || '';
  }).filter(Boolean);
}

function listarAcessosSenha_(options) {
  const sheet = obterPlanilha_().getSheetByName('Itens');

  if (!sheet) {
    return [];
  }

  const filtros = options.filtros || {};

  return lerAbaComoObjetos_(sheet).filter(function(item) {
    if (normalizar_(item.tipo) !== 'senha_acesso') {
      return false;
    }

    if (!options.gestor && normalizar_(item.status) !== 'ativo') {
      return false;
    }

    if (filtros.status && normalizar_(item.status) !== filtros.status) {
      return false;
    }

    if (filtros.categoria && String(item.categoria || '') !== filtros.categoria) {
      return false;
    }

    if (filtros.grupo && String(item.grupo || '') !== filtros.grupo) {
      return false;
    }

    return true;
  }).map(function(item) {
    return {
      id: item.id_item || '',
      titulo: item.titulo || '',
      descricao: item.descricao || '',
      url: item.url || '',
      login: item.login || '',
      senha: item.senha || '',
      categoria: item.categoria || '',
      grupo: item.grupo || '',
      status: item.status || ''
    };
  }).sort(function(a, b) {
    return String(a.titulo).localeCompare(String(b.titulo));
  });
}

function obterResumoSenhas_(gestor) {
  const acessos = listarAcessosSenha_({
    filtros: {},
    gestor: Boolean(gestor)
  });

  return acessos.reduce(function(acc, item) {
    acc.total += 1;

    if (normalizar_(item.status) === 'ativo') {
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

function listarHistoricoSenhas_(limite) {
  const sheet = obterPlanilha_().getSheetByName('Historico_Auditoria');

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).filter(function(row) {
    return row.acao === 'savePasswordItem';
  }).sort(function(a, b) {
    const dataA = converterData_(a.data_evento);
    const dataB = converterData_(b.data_evento);
    return (dataB ? dataB.getTime() : 0) - (dataA ? dataA.getTime() : 0);
  }).slice(0, limite || 8).map(function(row) {
    const detalhes = parseJsonSeguro_(row.detalhes);

    return {
      data_evento: formatarDataHora_(row.data_evento),
      usuario_email: row.usuario_email || '',
      titulo: detalhes.titulo || '',
      status: detalhes.status || '',
      operacao: detalhes.operacao || '',
      id: detalhes.id || ''
    };
  });
}

function parseJsonSeguro_(texto) {
  try {
    return JSON.parse(String(texto || '{}'));
  } catch (error) {
    return {};
  }
}

function listarProdutosAr_(config) {
  const sheet = obterSheetProdutosAr_(config);

  if (!sheet) {
    return [];
  }

  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return [];
  }

  const headers = values[0].map(function(header) {
    return String(header || '').trim();
  });

  return values.slice(1).map(function(row, index) {
    return normalizarProdutoAr_(row, headers, index + 2);
  }).filter(function(produto) {
    return produto.tem_dados && produto.ativo;
  });
}

function obterProdutoArPorId_(config, produtoId) {
  if (!produtoId) {
    return null;
  }

  const produtos = listarProdutosAr_(config);

  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === produtoId) {
      return produtos[i];
    }
  }

  return null;
}

function obterSheetProdutosAr_(config) {
  const spreadsheetId = String(config.ar_produtos_spreadsheet_id || '').trim();

  if (!spreadsheetId) {
    return null;
  }

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const nomeAba = String(config.ar_produtos_sheet_name || 'Produtos').trim();

  return ss.getSheetByName(nomeAba)
    || ss.getSheetByName('Produtos')
    || ss.getSheetByName('produtos_ar')
    || ss.getSheets()[0];
}

function normalizarProdutoAr_(row, headers, rowNumber) {
  const produto = {
    id: `produto_${rowNumber}`,
    _row: rowNumber,
    row_number: rowNumber,
    product_id: obterValorAlias_(row, headers, ['product_id', 'product id', 'id_produto', 'produto_id', 'codigo_produto']),
    descricao_comercial: obterValorAlias_(row, headers, ['descricao_comercial', 'descrição comercial', 'descricao', 'descrição', 'produto', 'nome']),
    ac: obterValorAlias_(row, headers, ['ac', 'autoridade_certificadora', 'autoridade certificadora']),
    tipo_certificado: obterValorAlias_(row, headers, ['tipo_certificado', 'tipo certificado', 'tipo']),
    midia: obterValorAlias_(row, headers, ['midia', 'mídia']),
    modelo: obterValorAlias_(row, headers, ['modelo']),
    validade: obterValorAlias_(row, headers, ['validade', 'prazo']),
    grupo: obterValorAlias_(row, headers, ['grupo', 'grupo_nome', 'nome_grupo']),
    codigo_grupo: obterValorAlias_(row, headers, ['codigo_grupo', 'código grupo', 'cod_grupo', 'grupo_codigo', 'grupo código', 'codigo', 'código']),
    preco_com_desconto: obterValorAlias_(row, headers, ['preco_com_desconto', 'preço com desconto', 'valor_com_desconto', 'valor com desconto', 'com desconto']),
    preco_sem_desconto: obterValorAlias_(row, headers, ['preco_sem_desconto', 'preço sem desconto', 'valor_sem_desconto', 'valor sem desconto', 'sem desconto']),
    grupo_com_desconto: obterValorAlias_(row, headers, ['grupo_com_desconto', 'grupo com desconto', 'grupo_desconto']),
    grupo_sem_desconto: obterValorAlias_(row, headers, ['grupo_sem_desconto', 'grupo sem desconto', 'grupo_sem_desconto']),
    url_base: obterValorAlias_(row, headers, ['url_base', 'url base']),
    link_com_desconto: obterValorAlias_(row, headers, ['link_com_desconto', 'link com desconto', 'url_com_desconto', 'url com desconto']),
    link_sem_desconto: obterValorAlias_(row, headers, ['link_sem_desconto', 'link sem desconto', 'url_sem_desconto', 'url sem desconto']),
    template_link_com_desconto: obterValorAlias_(row, headers, ['template_link_com_desconto', 'template link com desconto', 'template_com_desconto']),
    template_link_sem_desconto: obterValorAlias_(row, headers, ['template_link_sem_desconto', 'template link sem desconto', 'template_sem_desconto']),
    status: obterValorAlias_(row, headers, ['status']),
    ativo_raw: obterValorAlias_(row, headers, ['ativo', 'status']),
    termos_busca: obterValorAlias_(row, headers, ['termos_busca', 'termos busca']),
    observacao: obterValorAlias_(row, headers, ['observacoes', 'observacao', 'observação', 'obs'])
  };

  produto.tem_dados = row.some(function(value) {
    return value !== '';
  });
  produto.ativo = valorAtivoAr_(produto.ativo_raw);
  produto.economia = calcularEconomiaAr_(produto.preco_com_desconto, produto.preco_sem_desconto);
  produto.grupo = produto.grupo || produto.grupo_com_desconto || produto.grupo_sem_desconto || '';
  produto.codigo_grupo = produto.codigo_grupo || produto.grupo_com_desconto || produto.grupo_sem_desconto || '';
  produto.alertas = [];

  if (!produto.product_id) {
    produto.alertas.push('Produto sem Product ID.');
  }

  if (!produto.preco_com_desconto || !produto.preco_sem_desconto) {
    produto.alertas.push('Preço incompleto.');
  }

  return produto;
}

function listarParceirosAr_() {
  const sheet = obterPlanilha_().getSheetByName('Parceiros');

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).map(function(row, index) {
    const id = row.id_parceiro || `parceiro_${index + 2}`;
    const status = row.status || (row.codigo_revendedor ? 'Ativo' : 'Pendente de código');
    const nomeCompleto = row.nome_completo || row.nome || '';

    return {
      id,
      _row: row._row || '',
      id_parceiro: id,
      nome: nomeCompleto,
      nome_completo: nomeCompleto,
      nome_empresa: row.nome_empresa || '',
      cnpj_empresa: row.cnpj_empresa || '',
      codigo_revendedor: row.codigo_revendedor || '',
      status,
      remunerado: row.remunerado || '',
      email_cadastro_certificado: row.email_cadastro_certificado || '',
      whatsapp_pessoal: row.whatsapp_pessoal || '',
      whatsapp_comercial: row.whatsapp_comercial || '',
      email_comercial: row.email_comercial || '',
      chave_pix: row.chave_pix || '',
      nome_chave_pix: row.nome_chave_pix || '',
      observacao: row.observacoes || row.observacao || '',
      observacoes: row.observacoes || row.observacao || ''
    };
  }).filter(function(parceiro) {
    return parceiro.nome;
  }).sort(function(a, b) {
    return String(a.nome).localeCompare(String(b.nome));
  });
}

function obterParceiroArPorId_(parceiroId) {
  const parceiros = listarParceirosAr_();

  for (let i = 0; i < parceiros.length; i++) {
    if (String(parceiros[i].id) === String(parceiroId)) {
      return parceiros[i];
    }
  }

  return null;
}

function montarLinkAr_(config, produto, parceiro, tipo) {
  const contexto = montarContextoLinkAr_(config, produto, parceiro);
  let template = '';

  if (tipo === 'com_desconto') {
    template = produto.template_link_com_desconto
      || produto.link_com_desconto
      || config.ar_link_com_desconto_template
      || '{url_base}?product_id={product_id}&codrev={codigo_revendedor}&grupo={grupo_com_desconto}';
  }

  if (tipo === 'sem_desconto') {
    template = produto.template_link_sem_desconto
      || produto.link_sem_desconto
      || config.ar_link_sem_desconto_template
      || '{url_base}?product_id={product_id}&codrev={codigo_revendedor}&grupo={grupo_sem_desconto}';
  }

  return limparUrlAr_(aplicarTemplateAr_(template, contexto));
}

function montarContextoLinkAr_(config, produto, parceiro) {
  const urlBase = produto.url_base || config.ar_url_base_padrao || '';

  return {
    url_base: urlBase,
    product_id: produto.product_id,
    produto_id: produto.product_id,
    id_produto: produto.product_id,
    codigo_revendedor: parceiro.codigo_revendedor,
    codrev: parceiro.codigo_revendedor,
    cod_revendedor: parceiro.codigo_revendedor,
    grupo_com_desconto: produto.grupo_com_desconto || '',
    grupo_sem_desconto: produto.grupo_sem_desconto || '',
    grupo: produto.grupo || '',
    codigo_grupo: produto.codigo_grupo || '',
    descricao_comercial: produto.descricao_comercial || '',
    ac: produto.ac || '',
    modelo: produto.modelo || '',
    validade: produto.validade || '',
    tipo_certificado: produto.tipo_certificado || '',
    midia: produto.midia || ''
  };
}

function aplicarTemplateAr_(template, contexto) {
  let output = String(template || '');

  Object.keys(contexto).forEach(function(key) {
    const value = encodeURIComponent(contexto[key] || '');
    output = output.replace(new RegExp('\\{' + key + '\\}', 'g'), value);
  });

  return output;
}

function limparUrlAr_(url) {
  return String(url || '')
    .replace(/\?&/g, '?')
    .replace(/&&/g, '&')
    .replace(/[?&]grupo=$/g, '')
    .trim();
}

function salvarHistoricoAr_(usuario, produto, parceiro, linkComDesconto, linkSemDesconto) {
  const sheet = obterPlanilha_().getSheetByName('Historico_Links');

  if (!sheet) {
    return null;
  }

  const precoCom = parseMoneyAr_(produto.preco_com_desconto);
  const precoSem = parseMoneyAr_(produto.preco_sem_desconto);
  const economia = precoSem - precoCom;
  const idHistorico = gerarIdAr_('HIS');
  const agora = new Date();
  const headers = obterHeaders_(sheet);
  const cols = obterMapaColunas_(headers);
  const row = new Array(headers.length).fill('');
  const set = function(nome, valor) {
    if (cols[nome] >= 0) {
      row[cols[nome]] = valor;
    }
  };

  set('id_historico', idHistorico);
  set('data_geracao', agora);
  set('data_hora', agora);
  set('usuario', usuario.email || '');
  set('usuario_email', usuario.email || '');
  set('parceiro', parceiro.nome_completo || parceiro.nome || '');
  set('parceiro_id', parceiro.id_parceiro || parceiro.id || '');
  set('codigo_revendedor', parceiro.codigo_revendedor || '');
  set('status_parceiro', parceiro.status || '');
  set('produto', produto.descricao_comercial || '');
  set('product_id', produto.product_id || '');
  set('ac', produto.ac || '');
  set('tipo_certificado', produto.tipo_certificado || '');
  set('midia', produto.midia || '');
  set('modelo', produto.modelo || '');
  set('validade', produto.validade || '');
  set('grupo', produto.codigo_grupo || produto.grupo || '');
  set('link', linkComDesconto || linkSemDesconto || '');
  set('link_com_desconto', linkComDesconto || '');
  set('link_sem_desconto', linkSemDesconto || '');
  set('preco_com_desconto', precoCom);
  set('preco_sem_desconto', precoSem);
  set('economia', economia);
  set('status', 'gerado');
  set('origem', 'Painel AR');
  set('observacoes', '');

  sheet.appendRow(row);

  return {
    id_historico: idHistorico,
    data_hora: agora,
    usuario_email: usuario.email || '',
    produto: produto.descricao_comercial || '',
    product_id: produto.product_id || '',
    parceiro: parceiro.nome_completo || parceiro.nome || '',
    parceiro_id: parceiro.id_parceiro || parceiro.id || '',
    codigo_revendedor: parceiro.codigo_revendedor || '',
    link_com_desconto: linkComDesconto || '',
    link_sem_desconto: linkSemDesconto || '',
    preco_com_desconto: precoCom,
    preco_sem_desconto: precoSem,
    economia
  };
}

function listarHistoricoAr_(limite) {
  const sheet = obterPlanilha_().getSheetByName('Historico_Links');

  if (!sheet) {
    return [];
  }

  return lerAbaComoObjetos_(sheet).sort(function(a, b) {
    const dataA = converterData_(a.data_geracao);
    const dataB = converterData_(b.data_geracao);
    return (dataB ? dataB.getTime() : 0) - (dataA ? dataA.getTime() : 0);
  }).slice(0, limite || 10).map(function(row) {
    return {
      data_geracao: formatarDataHora_(row.data_geracao),
      usuario: row.usuario || row.usuario_email || '',
      parceiro: row.parceiro || '',
      produto: row.produto || '',
      product_id: row.product_id || '',
      grupo: row.grupo || '',
      status: row.status || ''
    };
  });
}

function obterValorAlias_(row, headers, aliases) {
  const mapa = {};

  headers.forEach(function(header, index) {
    mapa[normalizarChaveAr_(header)] = index;
  });

  for (let i = 0; i < aliases.length; i++) {
    const index = mapa[normalizarChaveAr_(aliases[i])];

    if (index !== undefined) {
      return row[index] == null ? '' : String(row[index]).trim();
    }
  }

  return '';
}

function normalizarChaveAr_(valor) {
  return String(valor || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function valorAtivoAr_(valor) {
  const texto = normalizarChaveAr_(valor);

  if (!texto) {
    return true;
  }

  return ['ativo', 'sim', 's', 'yes', 'true', '1'].indexOf(texto) >= 0;
}

function calcularEconomiaAr_(comDesconto, semDesconto) {
  const com = parseNumeroAr_(comDesconto);
  const sem = parseNumeroAr_(semDesconto);

  if (com == null || sem == null) {
    return '';
  }

  return String(Math.max(sem - com, 0).toFixed(2)).replace('.', ',');
}

function parseMoneyAr_(valor) {
  const numero = parseNumeroAr_(valor);
  return numero == null ? 0 : numero;
}

function parseNumeroAr_(valor) {
  if (valor === '' || valor == null) {
    return null;
  }

  const texto = String(valor || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');

  if (!texto) {
    return null;
  }

  const numero = Number(texto);

  return isNaN(numero) ? null : numero;
}

function gerarIdAr_(prefixo) {
  const timestamp = Utilities.formatDate(new Date(), obterTimeZone_(), 'yyyyMMddHHmmss');
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `${prefixo}-${timestamp}-${random}`;
}

function parseListaEmails_(valor) {
  return String(valor || '').split(',').map(function(email) {
    return normalizar_(email);
  }).filter(Boolean);
}

function adicionarEmailLista_(emails, email) {
  if (emails.indexOf(email) === -1) {
    emails.push(email);
  }

  return emails;
}

function removerEmailLista_(emails, email) {
  return emails.filter(function(item) {
    return item !== email;
  });
}

function obterTipoLinkPorEscopo_(escopo) {
  const normalizado = normalizar_(escopo);

  if (normalizado === 'ar') {
    return 'link_ar';
  }

  if (normalizado === 'gestao') {
    return 'link_gestao';
  }

  return 'link_corretora';
}

function obterMapaColunas_(headers) {
  const mapa = {};

  headers.forEach(function(header, index) {
    mapa[header] = index;
  });

  return mapa;
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

function diagnosticoFase2() {
  garantirAbasBase();
  garantirConfigPadrao();

  return sucesso_('diagnosticoFase2', {
    usuario: obterUsuarioAutorizado_(),
    administracao: {
      config_total: obterConfigDetalhada_().length,
      categorias: obterResumoEntidadeAdmin_('categorias'),
      grupos: obterResumoEntidadeAdmin_('grupos'),
      auditoria: obterResumoAuditoria_()
    },
    endpoints: [
      'getAdminData',
      'saveConfig',
      'restoreDefaultColors',
      'listAdminRecords',
      'saveAdminRecord'
    ],
    timestamp: new Date().toISOString()
  });
}

function diagnosticoFase3() {
  garantirAbasBase();
  const usuario = obterUsuarioAutorizado_();
  const sheet = obterPlanilha_().getSheetByName('Itens');
  const rows = sheet ? lerAbaComoObjetos_(sheet) : [];
  const email = normalizar_(usuario.email);
  const resumo = rows.reduce(function(acc, item) {
    const tipo = normalizar_(item.tipo);

    if (['link_corretora', 'link_ar', 'link_gestao'].indexOf(tipo) >= 0) {
      acc.total_links += 1;

      if (normalizar_(item.status) === 'ativo') {
        acc.ativos += 1;
      } else {
        acc.inativos += 1;
      }
    }

    if (parseListaEmails_(item.favorito_emails).indexOf(email) >= 0) {
      acc.favoritos_usuario += 1;
    }

    return acc;
  }, {
    total_links: 0,
    ativos: 0,
    inativos: 0,
    favoritos_usuario: 0
  });

  return sucesso_('diagnosticoFase3', {
    usuario,
    resumo,
    endpoints: [
      'getLinksData',
      'saveLinkItem',
      'toggleFavoriteLink'
    ],
    timestamp: new Date().toISOString()
  });
}

function obterResumoEntidadeAdmin_(entidadeNome) {
  const entidade = obterEntidadeAdmin_(entidadeNome);
  const sheet = obterPlanilha_().getSheetByName(entidade.sheet);
  const records = sheet
    ? lerAbaComoObjetos_(sheet).map(function(row) {
      return normalizarRegistroAdmin_(row, entidade);
    })
    : [];

  return records.reduce(function(acc, record) {
    acc.total += 1;

    if (normalizar_(record.status) === 'ativo') {
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

function obterResumoAuditoria_() {
  const sheet = obterPlanilha_().getSheetByName('Historico_Auditoria');

  if (!sheet) {
    return {
      total: 0,
      ultimas_acoes: []
    };
  }

  const rows = lerAbaComoObjetos_(sheet);
  const ultimas = rows.slice(-5).reverse().map(function(row) {
    return {
      data_evento: formatarDataHora_(row.data_evento),
      usuario_email: row.usuario_email || '',
      acao: row.acao || '',
      entidade: row.entidade || ''
    };
  });

  return {
    total: rows.length,
    ultimas_acoes: ultimas
  };
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
    const marcadoComoFavorito = parseListaEmails_(item.favorito_emails).indexOf(emailUsuario) >= 0;

    return statusAtivo && marcadoComoFavorito && item.url;
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

function formatarDataHora_(valor) {
  const data = converterData_(valor);

  if (!data) {
    return '';
  }

  return Utilities.formatDate(data, obterTimeZone_(), 'dd/MM/yyyy HH:mm');
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
