module.exports = {
  set: function (f, v) {
     if (typeof v !== 'number') {
       throw new Error('Cost must be a number');
     }
  }
};
