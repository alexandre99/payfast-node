var fs = require('fs');

fs.createReadStream('formas-de-pagamento.png')
  .pipe(fs.createWriteStream('imagem-com-stream.png'))
  .on('finish', () => {
      console.log('arquivo escrito por stream');
  });
