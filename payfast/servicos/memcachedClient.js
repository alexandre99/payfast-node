var memchached = require('memcached');

function createMencachedClient() {
  let cliente = new memchached('localhost:11211', {
    retries: 10,
    retry: 10000,
    remove: true
  });
  return cliente;
}

module.exports = () => createMencachedClient;
