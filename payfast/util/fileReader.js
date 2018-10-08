var fs = require('fs');

fs.readFile('formas-de-pagamento.png', (error, buffer) => {
  console.log('arquivo lido');
  fs.writeFile('formas-de-pagamento2.png', buffer, error => {
    console.log('arquivo escrito');
  });
});
