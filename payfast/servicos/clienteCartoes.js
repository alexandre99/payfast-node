var restify = require('restify-clients');

function CartoesClient() {
  this._client = restify.createJsonClient({
    url: 'http://localhost:3001'
  });
}

CartoesClient.prototype.autoriza = function(cartao, callback) {
  this._client.post('/cartoes/autoriza', cartao, callback);
};

module.exports = () => CartoesClient;
