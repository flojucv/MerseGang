/**
 * 
 * @param {Object} o Un objet json contenant au maximum les paramètres suivant : {
                                                                                    includeUpperCase: true,
                                                                                    includeNumbers: true,
                                                                                    length: 5,
                                                                                    startsWithLowerCase: true
                                                                                 }
 * @returns {String} Une chaine de caractère aléatoire.
 */
module.exports.strRandom = function(o) {
    var a = 10,
        b = 'abcdefghijklmnopqrstuvwxyz',
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
}

/**
 * 
 * @param {int} min Le nombre minimum (inclus) pour l'intervale de valeur.
 * @param {int} max Le nombre maximum (exclus) pour l'intervale de valeur.
 * @returns {int} Un nombre aléatoire compris entre le minimum (inclus) et le maximum (exclus).
 */
module.exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}