function PagamentoDao(connection) {
   this._connection = connection;
}

PagamentoDao.prototype.salva = function (pagamento,callback) {
    this._connection.connect();
    let query = {
        text: 'INSERT INTO pagamentos(forma_de_pagamento, valor, moeda, descricao, status, data) '
               + 'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [pagamento.forma_de_pagamento, pagamento.valor, pagamento.moeda, 
                    pagamento.descricao, pagamento.status, pagamento.data]
    }
    this._connection.query(query, callback);
};

PagamentoDao.prototype.atualiza = function (pagamento,callback) {
    this._connection.connect();
    let query = {
        text: 'UPDATE pagamentos SET status = $1 WHERE id = $2',
        values: [pagamento.status, pagamento.id]
    }
    this._connection.query(query, callback);
};

PagamentoDao.prototype.lista = function (callback)  {
    this._connection.connect();
    let query = {text: 'SELECT * FROM pagamentos'}
    this._connection.query(query, callback);
};

PagamentoDao.prototype.buscaPorId = function (id, callback) {
    this._connection.connect();
    let query = {
        text: 'SELECT * FROM pagamentos WHERE id = $1',
        values: [id]
    }
    this._connection.query(query, callback);
};

module.exports = function() {
  return PagamentoDao;
}