module.exports = {
  get: function get (f) {
    return f('pet.breed') + ': ' + f('pet.name');
  }
};
