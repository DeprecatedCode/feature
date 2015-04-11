var petshop = require('./builds/shop.js');

var store = petshop.store();

var dog = petshop.pet({
  breed: 'Cocker Spaniel',
  age: 8
});

store.inventory.push({
  item: dog,
  cost: 320
});

console.log(JSON.stringify(store, null, 2));

// Invalid breed

var dog = petshop.pet({
  breed: 'Lion',
  age: 1
});
