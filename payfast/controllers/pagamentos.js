var logger = require('../servicos/logger');

module.exports = app => {
  const validarDadosPagamento = req => {
    req
      .assert(
        'pagamento.forma_de_pagamento',
        'Forma de pagamento é obrigatória.'
      )
      .notEmpty();
    req
      .assert('pagamento.valor', 'Valor é obrigatório e deve ser um decimal.')
      .notEmpty()
      .isFloat();
    req
      .assert('pagamento.moeda', 'Moeda é obrigatória e deve ter 3 caracteres')
      .notEmpty()
      .len(3, 3);

    return req.validationErrors();
  };

  const criarPagamentoDao = connection => {
    return new app.persistencia.PagamentoDao(connection);
  };

  const ehPagamentoCartao = pagamento =>
    pagamento.forma_de_pagamento === 'cartao';

  const montarResponseDevolucaoPagamentoCriado = pagamentoCriado => {
    let response = {
      dados_do_pagamento: pagamentoCriado,
      links: [
        {
          href:
            'http://localhost:3000/pagamentos/pagamento/' + pagamentoCriado.id,
          rel: 'confirmar',
          method: 'PUT'
        },
        {
          href:
            'http://localhost:3000/pagamentos/pagamento/' + pagamentoCriado.id,
          rel: 'cancelar',
          method: 'delete'
        }
      ]
    };
    return response;
  };

  const autorizarCartao = (req, res, pagamentoCriado) => {
    let cartao = req.body['cartao'];

    let clienteCartoes = new app.servicos.clienteCartoes();
    clienteCartoes.autoriza(cartao, (exception, request, response, retorno) => {
      if (exception) {
        console.log(exception);
        res.status(400).json(exception);
      } else {
        console.log(retorno);
        let cartaoResponse = montarResponseDevolucaoPagamentoCriado(
          pagamentoCriado
        );
        cartaoResponse.cartao = retorno;
        res.status(201).json(cartaoResponse);
      }
    });
  };

  const atualizaPagamento = (req, res, pagamento, msgLog, statusCode) => {
    let id = req.params.id;
    pagamento.id = id;

    let connection = app.persistencia.connectionFactory();
    let pagamentoDAO = criarPagamentoDao(connection);

    pagamentoDAO.atualiza(pagamento, erro => {
      connection.end();
      if (erro) {
        res.status(500).send(erro);
      } else {
        console.log(msgLog);
        res.status(statusCode).json(pagamento);
      }
    });
  };

  const addPagamentoNoMemcached = pagamento => {
    let memcachedClient = app.servicos.memcachedClient();
    let id = pagamento.id;
    memcachedClient.set('pagamento-' + id, pagamento, 60000, function(erro) {
      console.log('nota chave adicionada ao cache: pagamento-' + id);
    });
  };

  const processarPagamentoSalvo = (req, res, erro, resultado) => {
    if (erro) {
      console.log(erro);
      res.status(500).json(erro);
      return;
    }
    console.log('pagamento criado');
    let pagamentoCriado = resultado.rows[0];
    addPagamentoNoMemcached(pagamentoCriado);
    res.location('/pagamentos/pagamento/' + pagamentoCriado.id);

    if (ehPagamentoCartao(pagamentoCriado)) {
      autorizarCartao(req, res, pagamentoCriado);
    } else {
      res
        .status(201)
        .json(montarResponseDevolucaoPagamentoCriado(pagamentoCriado));
    }
  };

  app.post('/pagamentos/pagamento', (req, res) => {
    let erros = validarDadosPagamento(req);

    if (erros) {
      console.log('Erros de validação encontrados');
      res.status(400).send(erros);
      return;
    }

    let pagamento = req.body['pagamento'];
    console.log('processando a requisição de um novo pagamento');
    pagamento.status = 'CRIADO';
    pagamento.data = new Date();

    let connection = app.persistencia.connectionFactory();
    let pagamentoDAO = criarPagamentoDao(connection);

    pagamentoDAO.salva(pagamento, (erro, resultado) => {
      connection.end();
      processarPagamentoSalvo(req, res, erro, resultado);
    });
  });

  app.put('/pagamentos/pagamento/:id', (req, res) => {
    let pagamento = {};
    pagamento.status = 'CONFIRMADO';
    atualizaPagamento(req, res, pagamento, 'Pagamento autorizado', 200);
  });

  app.delete('/pagamentos/pagamento/:id', (req, res) => {
    let pagamento = {};
    pagamento.status = 'CANCELADO';
    atualizaPagamento(req, res, pagamento, 'Pagamento cancelado', 204);
  });

  app.get('/pagamentos', (req, res) => {
    res.send('ok');
  });

  app.get('/pagamentos/pagamento/:id', (req, res) => {
    let id = req.params.id;
    console.log('Consultando pagamento: ' + id);
    logger.log('info', 'Consultando pagamento: ' + id);

    let memcachedClient = app.servicos.memcachedClient();
    memcachedClient.get('pagamento-' + id, (erro, retorno) => {
      if (erro || !retorno) {
        console.log('MISS - chave não encontrada');
        consultarPagamentoPorId(id, res);
      } else {
        console.log('HIT -  valor: ' + JSON.stringify(retorno));
        res.json(retorno);
      }
    });
  });

  const consultarPagamentoPorId = (id, res) => {
    let connection = app.persistencia.connectionFactory();
    let pagamentoDAO = criarPagamentoDao(connection);

    pagamentoDAO.buscaPorId(id, (erro, resultado) => {
      connection.end();
      if (erro) {
        console.log('Erro ao consultar no banco: ' + erro);
        res.status(500).send(erro);
      } else {
        console.log('pagamento encontrado: ' + resultado.rows[0]);
        res.json(resultado.rows[0]);
      }
    });
  };
};
