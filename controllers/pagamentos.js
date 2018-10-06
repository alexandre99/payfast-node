module.exports = app => {
  app.get('/pagamentos', (req, res) => {res.send('ok')});
  app.post('/pagamentos/pagamento', (req , res) => {
    let pagamento = req.body;

    req.assert('forma_de_pagamento', 'Forma de pagamento é obrigatória.').notEmpty();
    req.assert('valor', 'Valor é obrigatório e deve ser um decimal.').notEmpty().isFloat();
    req.assert('moeda', 'Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3,3);

    var errors = req.validationErrors();

    if (errors){
        console.log('Erros de validação encontrados');
        res.status(400).send(errors);
        return;
    }

    console.log('processando a requisição de um novo pagamento');
    pagamento.status = 'CRIADO';
    pagamento.data = new Date();

    let connection = app.persistencia.connectionFactory();
    let pagamentoDAO = new app.persistencia.PagamentoDao(connection);

    pagamentoDAO.salva(pagamento, (erro, resultado) => {
      connection.end();
      if (erro) {
        console.log(erro);
        res.status(500).json(erro);
      }
      console.log('pagamento criado');
      let pagamentoCriado = resultado.rows[0];
      res.location('/pagamentos/pagamento/' + pagamentoCriado.id);
      res.status(201).json(pagamentoCriado);
    });

  });
};
