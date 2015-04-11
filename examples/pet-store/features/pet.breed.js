module.exports = {
  set: function (f, v) {
    if (f('breeds').indexOf(v) === -1) {
      throw new Error('Pet breed "%" is not valid'.replace('%', v));
    }
  }
};

