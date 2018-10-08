module.exports = app => {
  app.post('/correios/calculo-prazo', (req, res) => {
    let dadosDaEntrega = req.body;

    let correioSOAPClient = new app.servicos.correiosSOAPClient();
    correioSOAPClient.calculaPrazo(dadosDaEntrega, (erro, resultado) => {
      if (erro) {
        res.status(500).send(erro);
      } else {
        console.log('Prazo calculado');
        res.json(resultado);
      }
    });
  });
};
