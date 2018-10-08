var soap = require('soap');

function CorreiosSOAPClient() {
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

module.exports = () => CorreiosSOAPClient;

CorreiosSOAPClient.prototype.calculaPrazo = function(dadosDaEntrega, callback) {
  soap.createClient(this._url, (erro, cliente) => {
    console.log('Cliente soap criado');
    cliente.CalcPrazo(dadosDaEntrega, callback);
  });
};
