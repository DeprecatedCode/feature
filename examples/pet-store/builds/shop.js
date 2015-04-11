var feature = require('../../../src/feature.js');

module.exports = feature.build(__dirname + '/../features', {
  pet: ['age', 'name', 'breed', 'breeds'],
  store: ['inventory'],
  storeItem: ['cost', 'item']
});
