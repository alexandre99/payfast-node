var fs = require('fs');
module.exports = app => {
  app.post('/upload/imagem', (req, res) => {
    console.log('Recebendo imagem');

    let fileName = req.headers.filename;
    req.pipe(fs.createWriteStream('files/' + fileName))
       .on('finish', () => {
          console.log('Arquivo escrito');
          res.status(201).send('Ok');
       });
  });
};
