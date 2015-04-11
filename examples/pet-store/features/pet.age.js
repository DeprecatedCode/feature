module.exports = {
  set: function (f, v) {
    if (typeof v !== 'number') {
      throw new Error('Pet age must be a number');
    }
  }
};
