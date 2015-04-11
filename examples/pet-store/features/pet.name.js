module.exports = {
  set: function (f, v) {
    if (typeof v !== 'string') {
      throw new Error('Pet name must be a string');
    }
  }
};
